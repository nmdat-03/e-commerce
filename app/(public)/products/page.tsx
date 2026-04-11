import FilterSidebar from "@/components/product/FilterSidebar";
import SortBar from "@/components/product/SortBar";
import MobileFilter from "@/components/product/MobileFilter";
import { getProductsCount, PAGE_SIZE } from "@/server/queries/product";
import { getCategories } from "@/server/queries/category";
import { getBrands } from "@/server/queries/brand";
import CustomPagination from "@/components/common/CustomPagination";
import { Suspense } from "react";
import ProductListSkeleton from "@/components/product/ProductListSkeleton";
import ProductListWrapper from "@/components/product/ProductListWrapper";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{
        q?: string;
        sort?: string;
        category?: string;
        brand?: string;
        page?: string;
    }>;
}) {
    const params = await searchParams;

    const q = params.q || "";

    const page = Number(params.page) || 1;

    const [total, categories, brand] = await Promise.all([
        getProductsCount({
            searchQuery: params.q,
            categorySlug: params.category,
            brandSlug: params.brand,
        }),
        getCategories(),
        getBrands(),
    ]);

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <div className="container py-6">
            <div className="flex gap-6">

                {/* DESKTOP FILTER */}
                <div className="hidden lg:block w-1/4">
                    <FilterSidebar
                        categories={categories}
                        brand={brand}
                    />
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-3/4 flex flex-col">
                    <div className="mb-4">
                        <MobileFilter
                            categories={categories}
                            brand={brand}
                        />
                    </div>
                    {/* TOP BAR */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                            {q
                                ? `Results for "${q}" (${total})`
                                : `All Products (${total})`}
                        </h2>

                        {/* RIGHT */}
                        <SortBar />
                    </div>

                    {/* PRODUCT LIST */}
                    <Suspense
                        key={`${q}-${params.sort}-${params.category}-${params.brand}-${page}`}
                        fallback={<ProductListSkeleton />}
                    >
                        <ProductListWrapper
                            q={q}
                            sort={params.sort}
                            category={params.category}
                            brand={params.brand}
                            page={page}
                            limit={PAGE_SIZE}
                        />
                    </Suspense>

                    {/* PAGINATION */}
                    <CustomPagination
                        currentPage={page}
                        totalPages={totalPages}
                    />
                </div>
            </div>
        </div>
    );
}