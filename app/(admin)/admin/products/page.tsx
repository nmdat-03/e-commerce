import prisma from "@/lib/prisma";
import AdminProductsClient from "./AdminProductsClient";
import CustomPagination from "@/components/common/CustomPagination";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const PAGE_SIZE = 10;

export default async function AdminProductsPage({
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

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        category: true,
      },
    }),

    prisma.product.count(),
  ]);

  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

  return (
    <div className="container py-6">
      <Suspense key={currentPage} fallback={<div>Loading...</div>}>
        <AdminProductsClient products={products} />
      </Suspense>

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}