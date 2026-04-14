import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import qs from "qs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const urlParams = req.nextUrl.searchParams;

    const params: Record<string, string> = {};

    urlParams.forEach((value, key) => {
      params[key] = value.replace(/ /g, "+");
    });

    console.log("IPN RAW PARAMS:", params);

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

    console.log("IPN SIGN DATA:", signData);
    console.log("VNP HASH:", secureHash);
    console.log("LOCAL HASH:", signed);

    if (secureHash !== signed) {
      return NextResponse.json({
        RspCode: "97",
        Message: "Invalid signature",
      });
    }

    return NextResponse.json({
      RspCode: "00",
      Message: "OK",
    });
  } catch (error) {
    console.error("IPN ERROR:", error);

    return NextResponse.json({
      RspCode: "99",
      Message: "Unknown error",
    });
  }
}
