"use client";

import Image from "next/image";

export default function PaymentMethod({
    value,
    onChange,
}: {
    value: "COD" | "VNPAY";
    onChange: (v: "COD" | "VNPAY") => void;
}) {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
            <h2 className="text-xl font-bold">Payment Method</h2>

            <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer">
                <input
                    type="radio"
                    checked={value === "COD"}
                    onChange={() => onChange("COD")}
                    className="accent-black"
                />
                <div className="flex items-center gap-2">
                    <Image
                        src="/icons/cod.png"
                        alt="VNPay"
                        width={24}
                        height={24}
                    />
                    <span>Cash on Delivery (COD)</span>
                </div>
            </label>

            <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer">
                <input
                    type="radio"
                    checked={value === "VNPAY"}
                    onChange={() => onChange("VNPAY")}
                    className="accent-black"
                />
                <div className="flex items-center gap-2">
                    <Image
                        src="/icons/vnpay.svg"
                        alt="VNPay"
                        width={80}
                        height={68}
                    />
                    <span>(Online Payment)</span>
                </div>
            </label>
        </div>
    );
}