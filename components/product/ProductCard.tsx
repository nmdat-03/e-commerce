"use client";

import Link from "next/link";
import Image from "next/image";
import { CircleAlert } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/format";

type ProductCardProps = {
    product: {
        id: string;
        name: string;
        price: number;
        slug: string;
        images: {
            url: string;
            isPrimary: boolean;
        }[];
    };
};

export default function ProductCard({ product }: ProductCardProps) {
    const image =
        product.images.find((img) => img.isPrimary)?.url ||
        product.images[0]?.url;

    return (
        <motion.div
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-white p-3 group rounded-xl shadow-md overflow-hidden"
        >
            {/* Image */}
            <Link href={`/product/${product.slug}`}>
                <div className="relative w-full aspect-square rounded-lg bg-gray-100 overflow-hidden">
                    {image ? (
                        <motion.div
                            className="w-full h-full"
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Image
                                src={image}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    ) : (
                        <div className="flex gap-2 items-center justify-center h-full text-gray-400">
                            <CircleAlert />
                            No Image
                        </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                </div>

                {/* Info */}
                <div className="mt-3 flex flex-col gap-2">
                    <h2 className="text-sm font-normal line-clamp-2 group-hover:text-black/80 transition">
                        {product.name}
                    </h2>
                    <p className="text-base font-semibold text-black">
                        {formatPrice(product.price)}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}