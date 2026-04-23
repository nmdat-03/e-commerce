import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { formatOrderTime, formatPrice } from "@/lib/format";
import Link from "next/link";
import UpdateOrderButton from "@/components/admin/UpdateOrderButton";
import CustomButton from "@/components/common/CustomButton";
import { ChevronLeft } from "lucide-react";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/common/Badges";

export default async function AdminOrderDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
        redirect("/");
    }

    const order = await prisma.order.findUnique({
        where: { id: params.id },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            user: true,
        },
    });

    if (!order) return notFound();

    return (
        <div className="container py-6 space-y-3">
            {/* Back */}
            <div>
                <Link href="/admin/orders">
                    <CustomButton className="flex items-center bg-white shadow-md rounded-full px-3 py-2 text-sm">
                        <ChevronLeft size={14} />
                        Back to orders
                    </CustomButton>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <h1 className="text-2xl font-bold">
                    Order Detail
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* ORDER INFO */}
                    <div className="bg-white p-4 rounded-xl shadow space-y-3">
                        <h2 className="font-semibold text-lg">
                            Order Info
                        </h2>

                        <p className="text-sm font-medium">
                            <span className="text-gray-500">Order ID:</span>{" "}
                            {order.id}
                        </p>

                        <p className="text-sm font-medium">
                            <span className="text-gray-500">Order Time:</span>{" "}
                            {formatOrderTime(order.createdAt)}
                        </p>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 font-medium">Status:</span>
                            <OrderStatusBadge status={order.orderStatus} />
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 font-medium">Payment:</span>
                            <PaymentStatusBadge status={order.paymentStatus} />
                        </div>

                        <p className="text-sm font-medium">
                            <span className="text-sm text-gray-500 font-medium">Method:</span>{" "}
                            {order.paymentMethod}
                        </p>

                        <p className="text-sm font-medium">
                            <span className="text-gray-500">Total:</span>{" "}
                            {formatPrice(order.total)}
                        </p>

                        {/* ACTIONS */}
                        <div className="flex gap-2 justify-end">
                            {order.orderStatus === "PENDING" && (
                                <>
                                    <UpdateOrderButton
                                        id={order.id}
                                        status="CONFIRMED"
                                    />
                                    <UpdateOrderButton
                                        id={order.id}
                                        status="CANCELLED"
                                    />
                                </>
                            )}

                            {order.orderStatus === "CONFIRMED" && (
                                <>
                                    <UpdateOrderButton
                                        id={order.id}
                                        status="SHIPPING"
                                    />
                                    <UpdateOrderButton
                                        id={order.id}
                                        status="CANCELLED"
                                    />
                                </>
                            )}

                            {order.orderStatus === "SHIPPING" && (
                                <UpdateOrderButton
                                    id={order.id}
                                    status="COMPLETED"
                                />
                            )}
                        </div>
                    </div>

                    {/* RECEIVER INFO */}
                    <div className="bg-white p-4 rounded-xl shadow space-y-2">
                        <h2 className="font-semibold text-lg">
                            User
                        </h2>

                        <p className="text-sm text-gray-600">
                            {order.user?.email || order.user?.phone}
                        </p>

                        <h2 className="font-semibold text-lg">
                            Receiver
                        </h2>

                        <p className="text-sm text-gray-600">
                            Full name: {order.fullName}
                        </p>

                        <p className="text-sm text-gray-600">
                            Phone: {order.phone}
                        </p>

                        <p className="text-sm text-gray-600">
                            Address: {order.address}
                        </p>
                    </div>
                </div>

                {/* ITEMS */}
                <div className="bg-white p-4 rounded-xl shadow space-y-4">
                    <h2 className="font-semibold text-lg">
                        Items
                    </h2>

                    {order.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">
                                        {item.product?.name || "Product deleted"}
                                    </p>

                                    <p className="text-sm">
                                        Quantity: x{item.quantity}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm">
                                        {formatPrice(item.price)}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-gray-400 my-3" />

                            <div className="flex justify-end">
                                <div className="flex gap-2 items-center">
                                    <p className="text-md text-gray-500">Total payment:</p>
                                    <span className="text-xl font-medium">
                                        {formatPrice(item.price * item.quantity)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}