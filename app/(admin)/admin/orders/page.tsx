import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminOrdersClient from "./AdminOrdersClient";
import CustomPagination from "@/components/common/CustomPagination";

const PAGE_SIZE = 10;

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
        redirect("/");
    }

    const params = await searchParams;
    const currentPage = Number(params.page || "1");

    const [orders, totalOrders] = await Promise.all([
        prisma.order.findMany({
            skip: (currentPage - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
            orderBy: { createdAt: "desc" },
            include: {
                user: true,
                items: {
                    select: {
                        quantity: true,
                    },
                },
            },
        }),
        prisma.order.count(),
    ]);

    const totalPages = Math.ceil(totalOrders / PAGE_SIZE);

    return (
        <div className="container py-6">
            <Suspense key={currentPage} fallback={<div>Loading...</div>}>
                <AdminOrdersClient orders={orders} />
            </Suspense>

            <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </div>
    );
}