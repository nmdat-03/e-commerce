import { getProducts } from "@/server/queries/product";
import ProductList from "./ProductList";

type Props = {
    q?: string;
    sort?: string;
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
        sort: sort as any,
        categorySlug: category,
        brandSlug: brand,
        page,
        limit,
    });

    return <ProductList products={products} />;
}