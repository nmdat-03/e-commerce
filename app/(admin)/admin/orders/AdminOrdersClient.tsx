"use client";

import { useState } from "react";
import Link from "next/link";
import {
    OrderStatus,
    Prisma,
} from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/format";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/common/Badges";

type OrderWithUser = Prisma.OrderGetPayload<{
    include: {
        user: true;
        items: {
            select: {
                quantity: true;
            };
        };
    };
}>;

type ConfirmState = {
    id: string;
    status: OrderStatus;
} | null;

export default function AdminOrdersClient({
    orders,
}: {
    orders: OrderWithUser[];
}) {
    const [orderList, setOrderList] = useState<OrderWithUser[]>(orders);
    const [confirm, setConfirm] = useState<ConfirmState>(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const patchOrder = async (id: string, status: OrderStatus) => {
        const oldOrders = orderList;

        setOrderList((prev) =>
            prev.map((o) =>
                o.id === id ? { ...o, orderStatus: status } : o
            )
        );

        try {
            setLoadingId(id);

            await fetch(`/api/admin/orders/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderStatus: status,
                }),
            });
        } catch {
            setOrderList(oldOrders);
        } finally {
            setLoadingId(null);
        }
    };

    const updateOrder = async (
        id: string,
        status: OrderStatus
    ) => {
        const needConfirm =
            status === OrderStatus.CANCELLED ||
            status === OrderStatus.COMPLETED;

        if (needConfirm) {
            setConfirm({ id, status });
            return;
        }

        await patchOrder(id, status);
    };

    const confirmSubmit = async () => {
        if (!confirm) return;

        await patchOrder(confirm.id, confirm.status);
        setConfirm(null);
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Orders</h1>

            <div className="border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-200">
                            <TableHead>ID</TableHead>
                            <TableHead>Receiver</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Items</TableHead>
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
                        {orderList.map((order) => {
                            const isLoading =
                                loadingId === order.id;

                            return (
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
                                        <p>
                                            {order.fullName}
                                        </p>
                                    </TableCell>

                                    <TableCell>
                                        <p>
                                            {order.phone}
                                        </p>
                                    </TableCell>


                                    <TableCell>
                                        {order.items.reduce(
                                            (sum, item) => sum + item.quantity,
                                            0
                                        )}
                                    </TableCell>


                                    <TableCell>
                                        {formatPrice(order.total)}
                                    </TableCell>

                                    <TableCell>
                                        <OrderStatusBadge status={order.orderStatus} />
                                    </TableCell>

                                    <TableCell>
                                        {order.paymentMethod}
                                    </TableCell>

                                    <TableCell>
                                        <PaymentStatusBadge status={order.paymentStatus} />
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2 flex-wrap">
                                            {order.orderStatus ===
                                                OrderStatus.PENDING && (
                                                    <>
                                                        <ActionButton
                                                            label="CONFIRM"
                                                            loading={isLoading}
                                                            onClick={() =>
                                                                updateOrder(
                                                                    order.id,
                                                                    OrderStatus.CONFIRMED
                                                                )
                                                            }
                                                        />

                                                        <ActionButton
                                                            label="CANCEL"
                                                            loading={isLoading}
                                                            onClick={() =>
                                                                updateOrder(
                                                                    order.id,
                                                                    OrderStatus.CANCELLED
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}

                                            {order.orderStatus ===
                                                OrderStatus.CONFIRMED && (
                                                    <>
                                                        <ActionButton
                                                            label="SHIP"
                                                            loading={isLoading}
                                                            onClick={() =>
                                                                updateOrder(
                                                                    order.id,
                                                                    OrderStatus.SHIPPING
                                                                )
                                                            }
                                                        />

                                                        <ActionButton
                                                            label="CANCEL"
                                                            loading={isLoading}
                                                            onClick={() =>
                                                                updateOrder(
                                                                    order.id,
                                                                    OrderStatus.CANCELLED
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}

                                            {order.orderStatus ===
                                                OrderStatus.SHIPPING && (
                                                    <ActionButton
                                                        label="COMPLETE"
                                                        loading={isLoading}
                                                        onClick={() =>
                                                            updateOrder(
                                                                order.id,
                                                                OrderStatus.COMPLETED
                                                            )
                                                        }
                                                    />
                                                )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {orderList.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="text-center py-8 text-gray-500"
                                >
                                    No orders found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {confirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-96 space-y-4">
                        <h2 className="text-lg font-semibold">
                            {confirm.status ===
                                OrderStatus.CANCELLED
                                ? "Cancel order?"
                                : "Complete order?"}
                        </h2>

                        <p className="text-sm text-gray-500">
                            {confirm.status ===
                                OrderStatus.CANCELLED
                                ? "This action cannot be undone."
                                : "Mark this order as successfully delivered."}
                        </p>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setConfirm(null)}
                                disabled={!!loadingId}
                                className="px-3 py-1 text-sm border rounded"
                            >
                                No
                            </button>

                            <button
                                onClick={confirmSubmit}
                                disabled={!!loadingId}
                                className={`px-3 py-1 text-sm text-white rounded ${confirm.status ===
                                    OrderStatus.CANCELLED
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-green-500 hover:bg-green-600"
                                    }`}
                            >
                                {loadingId
                                    ? "Processing..."
                                    : "Yes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ActionButton({
    onClick,
    label,
    loading,
}: {
    onClick: () => void;
    label: string;
    loading?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="px-3 py-1 bg-black text-white rounded text-sm disabled:opacity-50"
        >
            {loading ? "..." : label}
        </button>
    );
}