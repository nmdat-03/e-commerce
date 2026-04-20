import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductForm from "@/components/product/ProductForm";
import Link from "next/link";
import CustomButton from "@/components/common/CustomButton";
import { ChevronLeft } from "lucide-react";

export default async function CreateProductPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
        redirect("/");
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

            <div className="space-y-3">
                <h1 className="text-2xl font-bold">
                    Add Product
                </h1>

                <ProductForm
                    categories={categories}
                />
            </div>
        </div>
    );
}