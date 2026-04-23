"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Prisma, OrderStatus } from "@prisma/client";
import { formatOrderTime, formatPrice } from "@/lib/format";
import {
    OrderStatusBadge,
    PaymentStatusBadge,
} from "../common/Badges";

type OrderWithItems = Prisma.OrderGetPayload<{
    include: {
        items: {
            include: {
                product: {
                    include: {
                        images: true;
                    };
                };
            };
        };
    };
}>;

export default function OrderCard({
    order,
}: {
    order: OrderWithItems;
}) {
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
                <div className="flex gap-2 items-center">
                    <p className="text-sm">Order status:</p>
                    <OrderStatusBadge status={order.orderStatus} />
                </div>
            </div>

            {/* Info */}
            <div className="text-sm text-gray-500 space-y-2">
                <p>
                    <span className="font-medium text-black">
                        Order ID:
                    </span>{" "}
                    {order.id}
                </p>

                <p>
                    <span className="font-medium text-black">
                        Order Time:
                    </span>{" "}
                    {formatOrderTime(order.createdAt)}
                </p>

                <div className="flex gap-2 items-center flex-wrap">
                    <span className="text-sm font-medium text-black">
                        {order.paymentMethod === "COD"
                            ? "Cash on Delivery (COD)"
                            : order.paymentMethod === "VNPAY"
                                ? "Online Payment (VNPay)"
                                : order.paymentMethod}
                    </span>

                    <PaymentStatusBadge
                        status={order.paymentStatus}
                    />
                </div>
            </div>

            {/* First Item */}
            {firstItem && (
                <div className="flex items-center justify-between text-sm border-b pb-3 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <Image
                            src={
                                firstItem.product?.images?.[0]?.url || "/no-image.png"
                            }
                            alt={
                                firstItem.product?.name || "Product"
                            }
                            width={60}
                            height={60}
                            className="rounded-lg object-cover border shrink-0"
                        />

                        <div className="min-w-0">
                            <p className="font-medium truncate">
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

            {/* Toggle */}
            {remainingItems.length > 0 && (
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpen(!open)}
                    className="text-sm text-gray-500 hover:underline"
                >
                    {open
                        ? "Hide items"
                        : `View ${remainingItems.length} more item(s)`}
                </motion.button>
            )}

            {/* Remaining Items */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        layout
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={{
                            visible: {
                                transition: { staggerChildren: 0.05, },
                            },
                            hidden: {},
                        }}
                    >
                        <div className="space-y-3">
                            {remainingItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    variants={{
                                        hidden: { opacity: 0, y: -8, },
                                        visible: { opacity: 1, y: 0, },
                                    }}
                                    transition={{ duration: 0.4, ease: easeInOut, }}
                                    className="flex items-center justify-between text-sm border-b pb-3 gap-3"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Image
                                            src={
                                                item.product?.images?.[0]?.url || "/no-image.png"
                                            }
                                            alt={
                                                item.product?.name || "Product"
                                            }
                                            width={60}
                                            height={60}
                                            className="rounded-lg object-cover border shrink-0"
                                        />

                                        <div className="min-w-0">
                                            <p className="font-medium truncate">
                                                {item.product?.name || "Product"}
                                            </p>

                                            <p className="text-gray-500">
                                                Quantity: x
                                                {
                                                    item.quantity
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <p className="font-semibold whitespace-nowrap">
                                        {formatPrice(
                                            item.price *
                                            item.quantity
                                        )}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <div className="flex justify-between items-center flex-wrap gap-3">
                {(order.orderStatus ===
                    OrderStatus.PENDING ||
                    order.orderStatus ===
                    OrderStatus.CONFIRMED) && (
                        <button
                            onClick={() =>
                                setShowConfirm(true)
                            }
                            className="px-3 py-1 text-sm bg-red-100 text-red-500 border border-red-500 rounded-md"
                        >
                            Cancel Order
                        </button>
                    )}

                <div className="flex gap-3 items-center flex-wrap">
                    <p className="text-md text-gray-500">
                        Total payment (
                        {order.items.length} items):
                    </p>

                    <p className="text-lg font-bold">
                        {formatPrice(order.total)}
                    </p>
                </div>
            </div>

            {/* Confirm Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl p-6 space-y-4 w-full max-w-md">
                        <h2 className="text-lg font-semibold">
                            Cancel order?
                        </h2>

                        <p className="text-sm text-gray-500">
                            Are you sure you want to
                            cancel this order?
                        </p>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() =>
                                    setShowConfirm(false)
                                }
                                disabled={loading}
                                className="px-3 py-1 text-sm border rounded"
                            >
                                No
                            </button>

                            <button
                                disabled={loading}
                                onClick={async () => {
                                    try {
                                        setLoading(true);

                                        await fetch(
                                            `/api/orders/${order.id}/cancel`,
                                            {
                                                method: "PATCH",
                                            }
                                        );

                                        window.location.reload();
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                            >
                                {loading
                                    ? "Cancelling..."
                                    : "Yes, cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}