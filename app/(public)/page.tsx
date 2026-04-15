import Hero from "@/components/common/Hero";
import BrandSection from "@/components/home/BrandSection";
import ProductList from "@/components/product/ProductList";
import { getBrands } from "@/server/queries/brand";
import { getNewestProducts } from "@/server/queries/product";
import { ArrowRight } from "lucide-react";
import Link from "next/link";


export default async function HomePage() {
    const products = await getNewestProducts(10)
    const brands = await getBrands()

    return (
        <div>
            {/* HERO */}
            <Hero />

            {/* CATEGORIES */}
            <div className="container py-6">
                <h2 className="text-xl font-semibold">Categories</h2>
            </div>

            {/* BRANDS */}
            <div className="container py-6">
                <h2 className="text-xl font-semibold mb-4">Brands</h2>
                <BrandSection brands={brands} />
            </div>

            {/* BEST SELLING PRODUCTS */}
            <div className="container py-6">
                <h2 className="text-xl font-semibold">Best Selling Products</h2>
            </div>

            {/* NEWEST PRODUCTS */}
            <div className="container py-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Newest Products</h2>

                    <Link
                        href="/products?sort=newest"
                        className="flex items-center gap-1 text-sm hover:underline"
                    >
                        View all <ArrowRight size={16} />
                    </Link>
                </div>
                <ProductList products={products} />
            </div>

        </div>
    );
}