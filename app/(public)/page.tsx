import Header from "@/components/common/Header";
import ProductList from "@/components/product/ProductList";
import { getNewestProducts } from "@/server/queries/product";


export default async function HomePage() {
    const products = await getNewestProducts(10)

    return (
        <div>

            <Header />
            <div className="container py-6">
                <h2 className="text-xl font-semibold mb-4">Newest Products</h2>
                <ProductList products={products} />
            </div>

        </div>
    );
}