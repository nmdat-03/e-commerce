import { getProducts } from "@/server/queries/product";
import ProductList from "./ProductList";

type SortType = "price_asc" | "price_desc" | "newest";

type Props = {
    q?: string;
    sort?: SortType;
    category?: string;
    brand?: string;
    page: number;
    limit: number;
};

export default async function ProductListWrapper({
    q,
    sort,
    category,
    brand,
    page,
    limit,
}: Props) {
    const products = await getProducts({
        searchQuery: q,
        sort: sort,
        categorySlug: category,
        brandSlug: brand,
        page,
        limit,
    });

    return <ProductList products={products} />;
}