import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import UpdateOrderButton from "@/components/admin/UpdateOrderButton";
import CustomButton from "@/components/common/CustomButton";
import { ChevronLeft } from "lucide-react";

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
                    <div className="bg-white p-4 rounded-xl shadow space-y-2">
                        <h2 className="font-semibold text-lg">
                            Order Info
                        </h2>

                        <p>
                            <span className="font-medium">ID:</span>{" "}
                            {order.id}
                        </p>

                        <p>
                            <span className="font-medium">Status:</span>{" "}
                            {order.orderStatus}
                        </p>

                        <p>
                            <span className="font-medium">Payment:</span>{" "}
                            {order.paymentStatus}
                        </p>

                        <p>
                            <span className="font-medium">Method:</span>{" "}
                            {order.paymentMethod}
                        </p>

                        <p>
                            <span className="font-medium">Total:</span>{" "}
                            {formatPrice(order.total)}
                        </p>

                        {/* ACTIONS */}
                        <div className="flex gap-2 pt-2">
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

                        <p>{order.user?.email}</p>

                        <h2 className="font-semibold text-lg">
                            Receiver
                        </h2>

                        <p className="font-medium">
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
                            className="flex justify-between items-center pb-2"
                        >
                            <div>
                                <p className="font-medium">
                                    {item.product?.name || "Product deleted"}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Price: {formatPrice(item.price)}
                                </p>
                            </div>

                            <p className="font-medium">
                                {formatPrice(item.price * item.quantity)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}