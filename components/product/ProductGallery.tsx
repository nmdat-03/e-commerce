"use client";

import { useState, forwardRef } from "react";
import Image from "next/image";

type ImageType = {
    url: string;
    isPrimary?: boolean;
};

type Props = {
    images: ImageType[];
};

const ProductGallery = forwardRef<HTMLDivElement, Props>(
    ({ images }, ref) => {
        const initialImage =
            images.find((img) => img.isPrimary)?.url || images[0]?.url;

        const [activeImage, setActiveImage] = useState(initialImage);

        if (!images.length) {
            return (
                <div className="flex items-center justify-center bg-gray-100 aspect-square rounded-xl text-gray-400">
                    No Image
                </div>
            );
        }

        return (
            <div>
                {/* Main Image */}
                <div className="w-full bg-gray-200 rounded-xl overflow-hidden flex justify-center">
                    <div
                        ref={ref}
                        className="relative w-full max-w-md aspect-square"
                    >
                        <Image
                            src={activeImage!}
                            alt="product"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 mt-3 overflow-x-auto">
                    {images.map((img) => (
                        <button
                            key={img.url}
                            onClick={() => setActiveImage(img.url)}
                            className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 ${
                                activeImage === img.url
                                    ? "border-gray-400"
                                    : "border-transparent"
                            }`}
                        >
                            <Image
                                src={img.url}
                                alt=""
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>
        );
    }
);

ProductGallery.displayName = "ProductGallery";

export default ProductGallery;