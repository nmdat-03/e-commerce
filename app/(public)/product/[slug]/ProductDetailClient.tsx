"use client";

import { useRef } from "react";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartButton from "@/components/cart/AddToCartButton";

export default function ProductDetailClient({ product }: any) {
    const imgRef = useRef<HTMLDivElement | null>(null);

    const primaryImage = product.images.find((img: any) => img.isPrimary)?.url || product.images[0]?.url;

    return (
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

                <ProductGallery ref={imgRef} images={product.images} />

                <div className="space-y-4 md:space-y-5">
                    <h1 className="text-lg md:text-xl font-bold">
                        {product.name}
                    </h1>

                    <p className="text-lg md:text-xl font-semibold">
                        ${product.price}
                    </p>

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
    );
}