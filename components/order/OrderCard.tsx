"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { formatOrderTime, formatPrice } from "@/lib/format";

export default function OrderCard({ order }: { order: any }) {
    const [open, setOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const firstItem = order.items[0];
    const remainingItems = order.items.slice(1);

    useEffect(() => {
        if (showConfirm) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showConfirm]);

    return (
        <div className="bg-white border rounded-2xl shadow-sm p-5 space-y-4">
            {/* Header */}
            <div className="flex justify-end">
                {/* ORDER STATUS */}
                <div className="flex gap-2 items-center">
                    <p className="text-sm">Order status:</p>
                    <span
                        className={`px-3 py-1 text-xs rounded-full font-medium 
                        ${order.orderStatus === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : order.orderStatus === "CONFIRMED"
                                    ? "bg-blue-100 text-blue-700"
                                    : order.orderStatus === "SHIPPING"
                                        ? "bg-purple-100 text-purple-700"
                                        : order.orderStatus === "COMPLETED"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {order.orderStatus}
                    </span>
                </div>
            </div>

            <div className="text-sm text-gray-500 space-y-2">
                <p>
                    <span className="font-medium text-black">Order ID:</span>{" "}
                    {order.id}
                </p>
                <p>{formatOrderTime(order.createdAt)}</p>
                {/* PAYMENT STATUS */}
                <div className="flex gap-2 items-center">
                    {/* METHOD */}
                    <span className="text-sm font-medium text-black">
                        {order.paymentMethod === "COD"
                            ? "Cash on Delivery (COD)"
                            : order.paymentMethod === "VNPAY"
                                ? "Online Payment (VNPay)"
                                : order.paymentMethod}
                    </span>

                    {/* STATUS */}
                    <span
                        className={`px-3 py-1 text-xs rounded-full font-medium 
                            ${order.paymentStatus === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : order.paymentStatus === "PAID"
                                    ? "bg-green-100 text-green-700"
                                    : order.paymentStatus === "FAILED"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-gray-100 text-gray-600"
                            }`}
                    >
                        {order.paymentStatus}
                    </span>
                </div>
            </div>

            {/* FIRST ITEM */}
            {firstItem && (
                <div className="flex items-center justify-between text-sm border-b pb-3">
                    <div className="flex items-center gap-3">
                        <Image
                            src={firstItem.product?.images[0]?.url || "/no-image.png"}
                            alt={firstItem.product?.name || "Product"}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover border"
                        />

                        <div>
                            <p className="font-medium">
                                {firstItem.product?.name || "Product"}
                            </p>
                            <p className="text-gray-500">
                                Quantity: x{firstItem.quantity}
                            </p>
                        </div>
                    </div>

                    <p className="font-semibold whitespace-nowrap">
                        {formatPrice(firstItem.price * firstItem.quantity)}
                    </p>
                </div>
            )}

            {/* DROPDOWN BUTTON */}
            {remainingItems.length > 0 && (
                <motion.button
                    onClick={() => setOpen(!open)}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm text-gray-500 hover:underline"
                >
                    {open
                        ? "Hide items"
                        : `View ${remainingItems.length} more item(s)`}
                </motion.button>
            )}

            {/* REMAINING ITEMS */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        layout
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={{
                            visible: {
                                transition: { staggerChildren: 0.05 }
                            },
                            hidden: {}
                        }}
                    >
                        <div className="space-y-3">
                            {remainingItems.map((item: any) => (
                                <motion.div
                                    key={item.id}
                                    variants={{
                                        hidden: { opacity: 0, y: -8 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    transition={{ duration: 0.4, ease: easeInOut }}
                                    className="flex items-center justify-between text-sm border-b pb-3"
                                >

                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={item.product?.images[0]?.url || "/no-image.png"}
                                            alt={item.product?.name || "Product"}
                                            width={60}
                                            height={60}
                                            className="rounded-lg object-cover border"
                                        />

                                        <div>
                                            <p className="font-medium">
                                                {item.product?.name || "Product"}
                                            </p>
                                            <p className="text-gray-500">
                                                Quantity: x{item.quantity}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="font-semibold whitespace-nowrap">
                                        ${item.price * item.quantity}
                                    </p>

                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <div className="flex justify-between items-center">
                {/* CANCEL BUTTON */}
                {(order.orderStatus === "PENDING" ||
                    order.orderStatus === "CONFIRMED") && (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-500 border border-red-500 rounded-md"
                        >
                            Cancel Order
                        </button>
                    )}

                <div className="flex gap-3 items-center">
                    <p className="text-md text-gray-500">
                        Total payment ({order.items.length} items):
                    </p>

                    <p className="text-lg font-bold">
                        {formatPrice(order.total)}
                    </p>
                </div>
            </div>
            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 space-y-4 w-96">
                        <h2 className="text-lg font-semibold">
                            Cancel order?
                        </h2>

                        <p className="text-sm text-gray-500">
                            Are you sure you want to cancel this order?
                        </p>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-3 py-1 text-sm border rounded"
                                disabled={loading}
                            >
                                No
                            </button>

                            <button
                                onClick={async () => {
                                    setLoading(true);
                                    await fetch(`/api/orders/${order.id}/cancel`, {
                                        method: "PATCH",
                                    });
                                    window.location.reload();
                                }}
                                className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                                disabled={loading}
                            >
                                {loading ? "Cancelling..." : "Yes, cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}