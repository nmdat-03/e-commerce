"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/format";

export default function AdminOrdersClient({ orders }: { orders: any[] }) {
    const [orderList, setOrderList] = useState(orders);
    const [confirm, setConfirm] = useState<{
        id: string;
        status: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const updateOrder = async (id: string, status: string) => {
        const needConfirm = status === "CANCELLED" || status === "COMPLETED";

        if (needConfirm) {
            setConfirm({ id, status });
            return;
        }

        const oldOrders = orderList;

        setOrderList((prev) =>
            prev.map((o) =>
                o.id === id ? { ...o, orderStatus: status } : o
            )
        );

        try {
            await fetch(`/api/admin/orders/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderStatus: status }),
            });
        } catch (err) {
            setOrderList(oldOrders);
        }
    };

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Admin Orders</h1>

            <div className="border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-200">
                            <TableHead>ID</TableHead>
                            <TableHead>Receiver</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="bg-white">
                        {orderList.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="underline"
                                    >
                                        {order.id}
                                    </Link>
                                </TableCell>

                                <TableCell>
                                    <div>
                                        <p className="font-medium">
                                            {order.fullName}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {order.phone}
                                        </p>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <p className="text-sm">
                                        {order.user?.email || order.user?.username || " - "}
                                    </p>
                                </TableCell>

                                <TableCell>
                                    {formatPrice(order.total)}
                                </TableCell>

                                <TableCell>
                                    <StatusBadge status={order.orderStatus} />
                                </TableCell>

                                <TableCell>
                                    <p>{order.paymentMethod}</p>
                                </TableCell>

                                <TableCell>
                                    <PaymentBadge status={order.paymentStatus} />
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {order.orderStatus === "PENDING" && (
                                            <>
                                                <ActionButton
                                                    onClick={() => updateOrder(order.id, "CONFIRMED")}
                                                    label="CONFIRM"
                                                />
                                                <ActionButton
                                                    onClick={() => updateOrder(order.id, "CANCELLED")}
                                                    label="CANCEL"
                                                />
                                            </>
                                        )}

                                        {order.orderStatus === "CONFIRMED" && (
                                            <>
                                                <ActionButton
                                                    onClick={() => updateOrder(order.id, "SHIPPING")}
                                                    label="SHIP"
                                                />
                                                <ActionButton
                                                    onClick={() => updateOrder(order.id, "CANCELLED")}
                                                    label="CANCEL"
                                                />
                                            </>
                                        )}

                                        {order.orderStatus === "SHIPPING" && (
                                            <ActionButton
                                                onClick={() => updateOrder(order.id, "COMPLETED")}
                                                label="COMPLETE"
                                            />
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* CONFIRM MODAL */}
            {confirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 space-y-4 w-96">
                        <h2 className="text-lg font-semibold">
                            {confirm.status === "CANCELLED"
                                ? "Cancel order?"
                                : "Complete order?"}
                        </h2>

                        <p className="text-sm text-gray-500">
                            {confirm.status === "CANCELLED"
                                ? "This action cannot be undone."
                                : "Mark this order as successfully delivered."}
                        </p>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setConfirm(null)}
                                className="px-3 py-1 text-sm border rounded"
                                disabled={loading}
                            >
                                No
                            </button>

                            <button
                                onClick={async () => {
                                    setLoading(true);

                                    const oldOrders = orderList;

                                    setOrderList((prev) =>
                                        prev.map((o) =>
                                            o.id === confirm.id
                                                ? { ...o, orderStatus: confirm.status }
                                                : o
                                        )
                                    );

                                    try {
                                        await fetch(`/api/admin/orders/${confirm.id}`, {
                                            method: "PATCH",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                                orderStatus: confirm.status,
                                            }),
                                        });
                                    } catch (err) {
                                        setOrderList(oldOrders);
                                    }

                                    setConfirm(null);
                                    setLoading(false);
                                }}
                                className={`px-3 py-1 text-sm text-white rounded
                                    ${confirm.status === "CANCELLED"
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-green-500 hover:bg-green-600"
                                    }`}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Yes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ActionButton({ onClick, label }: { onClick: () => void; label: string }) {
    return (
        <button
            onClick={onClick}
            className="px-3 py-1 bg-black text-white rounded text-sm"
        >
            {label}
        </button>
    );
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-700",
        CONFIRMED: "bg-blue-100 text-blue-700",
        SHIPPING: "bg-purple-100 text-purple-700",
        COMPLETED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700",
    };

    return (
        <span className={`px-2 py-1 text-xs rounded-full ${map[status]}`}>
            {status}
        </span>
    );
}

function PaymentBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-700",
        PAID: "bg-green-100 text-green-700",
        FAILED: "bg-red-100 text-red-700",
        REFUNDED: "bg-gray-200 text-gray-700",
    };

    return (
        <span className={`px-2 py-1 text-xs rounded-full ${map[status]}`}>
            {status}
        </span>
    );
}
