import FilterSidebar from "@/components/product/FilterSidebar";
import SortBar from "@/components/product/SortBar";
import MobileFilter from "@/components/product/MobileFilter";
import {
    getProductsCount,
    PAGE_SIZE,
} from "@/server/queries/product";
import { getCategories } from "@/server/queries/category";
import { getBrands } from "@/server/queries/brand";
import CustomPagination from "@/components/common/CustomPagination";
import { Suspense } from "react";
import ProductListSkeleton from "@/components/product/ProductListSkeleton";
import ProductListWrapper from "@/components/product/ProductListWrapper";

export default async function ProductsContent({
    searchParams,
}: {
    searchParams: {
        q?: string;
        sort?: string;
        category?: string;
        brand?: string;
        page?: string;
    };
}) {
    const q = await searchParams.q || "";
    const sort = await (searchParams.sort as any) || "newest";
    const page = Number(searchParams.page) || 1;

    const [total, categories, brand] = await Promise.all([
        getProductsCount({
            searchQuery: searchParams.q,
            categorySlug: searchParams.category,
            brandSlug: searchParams.brand,
        }),
        getCategories(),
        getBrands(),
    ]);

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
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
                {/* MOBILE FILTER */}
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
                            : `All Products (${total})`
                        }
                    </h2>

                    <SortBar />
                </div>

                {/* PRODUCT LIST */}
                <Suspense
                    key={`${q}-${searchParams.sort}-${searchParams.category}-${searchParams.brand}-${page}`}
                    fallback={<ProductListSkeleton />}
                >
                    <ProductListWrapper
                        q={q}
                        sort={sort}
                        category={searchParams.category}
                        brand={searchParams.brand}
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
    );
}