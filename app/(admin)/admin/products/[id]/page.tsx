import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import ProductForm from "@/components/product/ProductForm";
import Link from "next/link";
import CustomButton from "@/components/common/CustomButton";
import { ChevronLeft } from "lucide-react";

export default async function EditProductPage({
    params,
}: {
    params: { id: string };
}) {
    const user = await getCurrentUser();
    const productId = await params.id;

    if (!user || user.role !== "ADMIN") {
        redirect("/");
    }

    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            images: {
                orderBy: {
                    position: "asc",
                },
            },
        },
    });

    if (!product) {
        notFound();
    }

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div className="container py-3 space-y-6">
            {/* Back */}
            <div>
                <Link href="/admin/products">
                    <CustomButton className="flex items-center bg-white shadow-md rounded-full px-3 py-2 text-sm">
                        <ChevronLeft size={14} />
                        Back to products
                    </CustomButton>
                </Link>
            </div>

            <div className="flex flex-col gap-3">
                <h1 className="text-2xl font-bold">
                    Edit Product
                </h1>

                <ProductForm
                    categories={categories}
                    product={product}
                    isEdit
                />
            </div>
        </div>
    );
}