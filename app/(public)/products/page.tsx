import ProductList from "@/components/product/ProductList";
import FilterSidebar from "@/components/product/FilterSidebar";
import SortBar from "@/components/product/SortBar";
import MobileFilter from "@/components/product/MobileFilter";
import { getProducts } from "@/server/queries/product";
import { Suspense } from "react";
import ProductListSkeleton from "@/components/product/ProductListSkeleton";

export default async function ProductsPage({ searchParams }: any) {
    const q = searchParams.q || "";

    const { products, total } = await getProducts({
        searchQuery: searchParams.q,
        sort: searchParams.sort,
        categoryId: searchParams.category,
    });

    return (
        <div className="container py-6">
            <div className="flex gap-6">

                {/* DESKTOP FILTER */}
                <div className="hidden lg:block w-1/4">
                    <FilterSidebar />
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-3/4 flex flex-col">
                    <div className="mb-4">
                        <MobileFilter />
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
                        key={`${searchParams.sort}-${searchParams.q}-${searchParams.category}`}
                        fallback={<ProductListSkeleton />}
                    >
                        <ProductList products={products} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}