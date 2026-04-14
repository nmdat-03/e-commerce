import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import qs from "qs";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const urlParams = req.nextUrl.searchParams;

    const params: Record<string, string> = {};

    urlParams.forEach((value, key) => {
      params[key] = value.replace(/ /g, "+");
    });

    console.log("RETURN RAW PARAMS:", params);

    const secureHash = params["vnp_SecureHash"];

    if (!secureHash) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order/failed`,
      );
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

    console.log("SIGN DATA:", signData);
    console.log("VNP HASH:", secureHash);
    console.log("LOCAL HASH:", signed);

    if (secureHash !== signed) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order/failed`,
      );
    }

    const orderId = params["vnp_TxnRef"];
    const responseCode = params["vnp_ResponseCode"];
    const amount = Number(params["vnp_Amount"]) / 100;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order/failed`,
      );
    }

    if (order.status === "PENDING") {
      if (amount === order.total) {
        if (responseCode === "00") {
          await prisma.$transaction([
            prisma.order.update({
              where: { id: orderId },
              data: { status: "PAID" },
            }),
            prisma.cartItem.deleteMany({
              where: {
                cart: { userId: order.userId },
                productId: {
                  in: order.items.map((i) => i.productId),
                },
              },
            }),
          ]);

          console.log("RETURN PAYMENT SUCCESS:", orderId);
        } else {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "CANCELLED" },
          });

          console.log("RETURN PAYMENT FAILED:", orderId);
        }
      } else {
        console.log("INVALID AMOUNT:", orderId);
      }
    }

    if (responseCode === "00") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?orderId=${orderId}`,
      );
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/order/failed`,
    );
  } catch (error) {
    console.error("RETURN ERROR:", error);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/order/failed`,
    );
  }
}
