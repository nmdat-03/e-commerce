"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/format";

type Item = {
    id: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
};

export default function OrderSummary({
    items,
    loading,
    onPlaceOrder,
}: {
    items: Item[];
    loading: boolean;
    onPlaceOrder: () => void;
}) {
    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-6 sticky top-5 h-fit">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="space-y-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between border p-3 rounded-lg"
                    >
                        <div className="flex items-center gap-3">
                            <Image
                                src={item.image || "/no-image.png"}
                                alt={item.name}
                                width={60}
                                height={60}
                                className="rounded-lg"
                            />
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                    x{item.quantity}
                                </p>
                            </div>
                        </div>

                        <p className="font-semibold">
                            {formatPrice(item.price * item.quantity)}
                        </p>
                    </div>
                ))}
            </div>

            <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
            </div>

            <button
                onClick={onPlaceOrder}
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2"
            >
                {loading && <Loader2 className="animate-spin" size={18} />}
                {loading ? "Processing..." : "Place Order"}
            </button>
        </div>
    );
}