"use client";

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
                />
                <span>Cash on Delivery (COD)</span>
            </label>

            <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer">
                <input
                    type="radio"
                    checked={value === "VNPAY"}
                    onChange={() => onChange("VNPAY")}
                />
                <span>VNPay (Online Payment)</span>
            </label>
        </div>
    );
}