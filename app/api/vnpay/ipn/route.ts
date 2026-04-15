import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import qs from "qs";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const urlParams = req.nextUrl.searchParams;

    const params: Record<string, string> = {};

    urlParams.forEach((value, key) => {
      params[key] = value.replace(/ /g, "+");
    });

    const secureHash = params["vnp_SecureHash"];

    if (!secureHash) {
      return NextResponse.json({
        RspCode: "97",
        Message: "Missing signature",
      });
    }

    delete params["vnp_SecureHash"];
    delete params["vnp_SecureHashType"];

    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc: Record<string, string>, key) => {
        acc[key] = params[key];
        return acc;
      }, {});

    const signData = qs.stringify(sortedParams, {
      encode: false,
    });

    const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET!);

    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash !== signed) {
      return NextResponse.json({
        RspCode: "97",
        Message: "Invalid signature",
      });
    }

    const orderId = params["vnp_TxnRef"];
    const responseCode = params["vnp_ResponseCode"];
    const amount = Number(params["vnp_Amount"]) / 100;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({
        RspCode: "01",
        Message: "Order not found",
      });
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json({
        RspCode: "02",
        Message: "Order already confirmed",
      });
    }

    if (amount !== order.total) {
      return NextResponse.json({
        RspCode: "04",
        Message: "Invalid amount",
      });
    }

    if (responseCode === "00") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          orderStatus: "CONFIRMED",
          paidAt: new Date(),
        },
      });

      console.log("IPN PAYMENT SUCCESS:", orderId);

      return NextResponse.json({
        RspCode: "00",
        Message: "Confirm Success",
      });
    } else {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "FAILED",
        },
      });

      console.log("IPN PAYMENT FAILED:", orderId);

      return NextResponse.json({
        RspCode: "00",
        Message: "Confirm Success",
      });
    }
  } catch (error) {
    console.error("IPN ERROR:", error);

    return NextResponse.json({
      RspCode: "99",
      Message: "Unknown error",
    });
  }
}
