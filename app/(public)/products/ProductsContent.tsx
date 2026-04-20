import FilterSidebar from "@/components/product/FilterSidebar";
import SortBar from "@/components/product/SortBar";
import MobileFilter from "@/components/product/MobileFilter";
import {
    getProductsCount,
    PAGE_SIZE,
} from "@/server/queries/product";
import { getCategories } from "@/server/queries/category";
import CustomPagination from "@/components/common/CustomPagination";
import { Suspense } from "react";
import ProductListSkeleton from "@/components/product/ProductListSkeleton";
import ProductListWrapper from "@/components/product/ProductListWrapper";

export default async function ProductsContent({
    searchParams,
}: {
    searchParams: Promise<{
        q?: string;
        sort?: string;
        category?: string;
        page?: string;
    }>;
}) {
    const params = await searchParams;

    const q = params.q || "";
    const sort = (params.sort as any) || "newest";
    const page = Number(params.page) || 1;

    const [total, categories] = await Promise.all([
        getProductsCount({
            searchQuery: params.q,
            categorySlug: params.category,
        }),
        getCategories(),
    ]);

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <div className="flex gap-6">
            <div className="hidden lg:block w-1/4">
                <FilterSidebar
                    categories={categories}
                />
            </div>

            <div className="w-full lg:w-3/4 flex flex-col">
                <div className="mb-4">
                    <MobileFilter
                        categories={categories}
                    />
                </div>

                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">
                        {q ? `Results for "${q}" (${total})` : `All Products (${total})`}
                    </h2>

                    <SortBar />
                </div>

                <Suspense
                    key={`${q}-${sort}-${params.category}-${page}`}
                    fallback={<ProductListSkeleton />}
                >
                    <ProductListWrapper
                        q={q}
                        sort={sort}
                        category={params.category}
                        page={page}
                        limit={PAGE_SIZE}
                    />
                </Suspense>

                <CustomPagination
                    currentPage={page}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
}