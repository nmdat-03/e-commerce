"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function FailedPage() {
    const params = useSearchParams();

    const orderId = params.get("orderId");
    const code = params.get("code");

    const getMessage = () => {
        switch (code) {
            case "24":
                return "The payment was cancelled.";
            case "51":
                return "Insufficient balance.";
            case "65":
                return "Transaction limit exceeded.";
            case "75":
                return "Bank system is temporarily unavailable.";
            case "invalid_checksum":
                return "Invalid request data.";
            case "missing_hash":
                return "Missing security signature.";
            case "invalid_amount":
                return "Payment amount mismatch.";
            case "order_not_found":
                return "Order not found.";
            case "server_error":
                return "An unexpected error occurred. Please try again.";
            default:
                return "Payment failed. Please try again.";
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center space-y-6">

                {/* Icon */}
                <div className="flex justify-center">
                    <div className="bg-red-100 p-4 rounded-full">
                        <XCircle className="text-red-600" size={40} />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold">
                    Payment Failed
                </h1>

                {/* Message */}
                <p className="text-gray-500 text-sm">
                    {getMessage()}
                </p>

                {/* Order ID */}
                {orderId && (
                    <div className="bg-gray-100 rounded-lg p-3 text-sm">
                        <span className="text-gray-500">Order ID:</span>
                        <p className="font-semibold break-all">{orderId}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <Link
                        href="/cart"
                        className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        Back to Cart
                    </Link>

                    {orderId && (
                        <Link
                            href={`/checkout?orderId=${orderId}`}
                            className="flex-1 bg-black text-white py-2 rounded-lg hover:opacity-90 transition"
                        >
                            Retry Payment
                        </Link>
                    )}
                </div>

            </div>
        </div>
    );
}