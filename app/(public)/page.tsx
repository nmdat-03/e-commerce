import Header from "@/components/common/Header";
import ProductList from "@/components/product/ProductList";
import { getProducts } from "@/server/queries/product";


export default async function HomePage() {
    const { products } = await getProducts({
        sort: "newest",
    })

    return (
        <div>

            <Header />
            <div className="container py-6">
                <h2 className="text-xl font-semibold mb-4">Product List</h2>
                <ProductList products={products} />
            </div>

        </div>
    );
}