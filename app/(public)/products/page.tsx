import ProductList from "@/components/product/ProductList";
import FilterSidebar from "@/components/product/FilterSidebar";
import SortBar from "@/components/product/SortBar";
import MobileFilter from "@/components/product/MobileFilter";
import { getProducts } from "@/server/queries/product";
import { getCategories } from "@/server/queries/category";
import { getBrands } from "@/server/queries/brand";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{
        q?: string;
        sort?: string;
        category?: string;
        brands?: string;
    }>;
}) {
    const params = await searchParams;

    const q = params.q || "";

    const [productData, categories, brands] = await Promise.all([
        getProducts({
            searchQuery: params.q,
            sort: params.sort,
            categorySlug: params.category,
            brandSlug: params.brands,
        }),
        getCategories(),
        getBrands(),
    ]);

    const { products, total } = productData;

    return (
        <div className="container py-6">
            <div className="flex gap-6">

                {/* DESKTOP FILTER */}
                <div className="hidden lg:block w-1/4">
                    <FilterSidebar
                        categories={categories}
                        brands={brands}
                    />
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-3/4 flex flex-col">
                    <div className="mb-4">
                        <MobileFilter
                            categories={categories}
                            brands={brands}
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
                    <ProductList products={products} />
                </div>
            </div>
        </div>
    );
}