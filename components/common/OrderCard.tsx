"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { formatOrderTime } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

export default function OrderCard({ order }: { order: any }) {
    const [open, setOpen] = useState(false);

    const firstItem = order.items[0];
    const remainingItems = order.items.slice(1);

    return (
        <div className="bg-white border rounded-2xl shadow-sm p-5 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 space-y-2">
                    <p>
                        <span className="font-medium text-black">Order ID:</span>{" "}
                        {order.id}
                    </p>
                    <p>{formatOrderTime(order.createdAt)}</p>
                </div>

                <span
                    className={`px-3 py-1 text-xs rounded-full font-medium 
                    ${order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "SHIPPING"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "COMPLETED"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                        }`}
                >
                    {order.status}
                </span>
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
            <div className="flex gap-2 justify-end items-center pt-2">
                <p className="text-md text-gray-500">
                    Total payment ({order.items.length} items):
                </p>

                <p className="text-lg font-bold">
                    {formatPrice(order.total)}
                </p>
            </div>
        </div>
    );
}