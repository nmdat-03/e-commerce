"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
    const params = useSearchParams();
    const orderId = params.get("orderId");

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center space-y-6">

                {/* Icon */}
                <div className="flex justify-center">
                    <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircle className="text-green-600" size={40} />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold">
                    Order placed successfully
                </h1>

                {/* Description */}
                <p className="text-gray-500 text-sm">
                    Thank you for your purchase. Your order has been received.
                </p>

                {/* Order ID */}
                <div className="bg-gray-100 rounded-lg p-3 text-sm">
                    <span className="text-gray-500">Order ID:</span>
                    <p className="font-semibold break-all">{orderId}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Link
                        href="/"
                        className="flex-1 bg-black text-white py-2 rounded-lg hover:opacity-90 transition"
                    >
                        Continue Shopping
                    </Link>

                    <Link
                        href="/orders"
                        className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        View Orders
                    </Link>
                </div>

            </div>
        </div>
    );
}