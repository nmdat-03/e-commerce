import OrderCard from "@/components/common/OrderCard";
import { getCurrentUser } from "@/lib/auth";
import { getOrdersByUser } from "@/server/queries/order";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const orders = await getOrdersByUser(user.id);

    if (orders.length === 0) {
        return (
            <div className="container py-10 text-center">
                No orders yet
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-6">
                <h1 className="text-2xl font-bold">My Orders</h1>

                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
}