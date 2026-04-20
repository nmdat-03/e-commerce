import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminOrdersClient from "./AdminOrdersClient";

export default async function AdminOrdersPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
        redirect("/");
    }

    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: true,
        },
    });

    return <AdminOrdersClient orders={orders} />;
}