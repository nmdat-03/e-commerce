import { getProductBySlug } from "@/server/queries/product";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetail({
    params,

}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const product = await getProductBySlug(slug);

    if (!product) return <div>Product not found</div>;

    return (
        <div className="container py-6">
            <ProductDetailClient product={product} />
        </div>
    );
}