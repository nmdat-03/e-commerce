import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import qs from "qs";
import { sortObject } from "@/lib/vnpay";
import { formatDate } from "@/lib/format";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.paymentMethod !== "VNPAY") {
      throw new Error("Invalid payment method");
    }

    if (order.paymentStatus !== "PENDING") {
      throw new Error("Order is not valid for payment");
    }

    if (order.orderStatus !== "PENDING") {
      throw new Error("Order cannot be paid");
    }

    if (order.total <= 0) {
      throw new Error("Invalid order amount");
    }

    const tmnCode = process.env.VNP_TMN_CODE!;
    const secretKey = process.env.VNP_HASH_SECRET!;
    const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

    const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/vnpay/return`;

    const date = new Date();

    const ipAddr =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    let vnp_Params: Record<string, any> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Amount: order.total * 100,
      vnp_CurrCode: "VND",
      vnp_TxnRef: order.id,
      vnp_OrderInfo: `Thanh toan don hang ${order.id}`,
      vnp_OrderType: "other",
      vnp_Locale: "vn",
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: formatDate(date),
    };

    const sortedParams = sortObject(vnp_Params);

    const signData = qs.stringify(sortedParams, {
      encode: false,
    });

    const hmac = crypto.createHmac("sha512", secretKey);
    const secureHash = hmac
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    sortedParams["vnp_SecureHash"] = secureHash;

    const paymentUrl =
      vnpUrl +
      "?" +
      qs.stringify(sortedParams, {
        encode: false,
      });

    // console.log("SIGN DATA:", signData);
    // console.log("SECURE HASH:", secureHash);
    // console.log("PAYMENT URL:", paymentUrl);

    return NextResponse.json({ url: paymentUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Create payment failed" },
      { status: 500 },
    );
  }
}
