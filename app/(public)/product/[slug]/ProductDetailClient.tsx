"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { ChevronLeft, ExternalLink } from "lucide-react";
import CustomButton from "@/components/common/CustomButton";
import { formatPrice } from "@/lib/format";

export default function ProductDetailClient({ product }: any) {
    const imgRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    const primaryImage =
        product.images.find((img: any) => img.isPrimary)?.url ||
        product.images[0]?.url;

    const goToProducts = (query: Record<string, string>) => {
        const params = new URLSearchParams(query);
        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between">
                {/* Back button */}
                <CustomButton
                    onClick={() => router.back()}
                    className="text-sm px-4 py-2 rounded-full shadow-md bg-white flex items-center"
                >
                    <ChevronLeft size={14} />
                    Back
                </CustomButton>
                <CustomButton className="flex gap-1 px-4 py-2 items-center justify-center text-sm rounded-full shadow-md bg-white">
                    <ExternalLink size={14} />
                    Share
                </CustomButton>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 space-y-6">

                {/* Top Navigation */}
                <div className="space-y-2">
                    {/* Breadcrumb */}
                    <div className="text-sm text-gray-500">
                        <span
                            className="hover:text-black cursor-pointer"
                            onClick={() => router.push("/products")}
                        >
                            Products
                        </span>

                        {" > "}

                        {product.category?.name && (
                            <>
                                <span
                                    className="hover:text-black cursor-pointer"
                                    onClick={() =>
                                        goToProducts({ category: product.category.slug })
                                    }
                                >
                                    {product.category.name}
                                </span>

                                {" > "}
                            </>
                        )}

                        <span className="text-gray-800 font-medium">
                            {product.name}
                        </span>
                    </div>
                </div>

                {/* Main content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <ProductGallery ref={imgRef} images={product.images} />

                    <div className="space-y-4 md:space-y-5">
                        {/* Product name */}
                        <h1 className="text-xl md:text-2xl font-medium">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <p className="text-xl md:text-2xl font-semibold text-black">
                            {formatPrice(product.price)}
                        </p>

                        {/* Add to cart */}
                        <AddToCartButton
                            imgRef={imgRef}
                            product={{
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: primaryImage,
                            }}
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="mt-10 border-t border-gray-300 pt-6">
                    <h2 className="text-lg md:text-xl font-semibold mb-3">
                        Description
                    </h2>

                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        {product.description || "No description available."}
                    </p>
                </div>
            </div>
        </div>

    );
}