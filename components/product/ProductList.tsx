import ProductCard from "./ProductCard";

type Props = {
    products: any[];
};

export default function ProductList({ products }: Props) {
    if (products.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No products found
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}