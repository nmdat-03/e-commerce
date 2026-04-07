"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import clsx from "clsx";
import { addToCart as addToCartDB } from "@/server/actions/cart";
import { useUser } from "@clerk/nextjs";
import { useFly } from "@/components/providers/FlyProvider";

type Props = {
    product: {
        id: string;
        name: string;
        price: number;
        image?: string;
    };
    imgRef?: React.RefObject<HTMLElement | null>;
    variant?: "default" | "card";
};

export default function AddToCartButton({
    product,
    imgRef,
    variant = "default",
}: Props) {
    const addToCart = useCartStore((state) => state.addToCart);
    const { isSignedIn } = useUser();
    const { triggerFly } = useFly();

    const handleAddToCart = async () => {
        const imgRect = imgRef?.current?.getBoundingClientRect();
        const cartEl = document.getElementById("cart-icon");
        const cartRect = cartEl?.getBoundingClientRect();

        if (imgRect && cartRect && product.image) {
            triggerFly({
                id: Date.now().toString(),
                image: product.image,
                start: {
                    top: imgRect.top,
                    left: imgRect.left,
                    width: imgRect.width,
                    height: imgRect.height,
                },
                end: {
                    top: cartRect.top + cartRect.height / 2 - imgRect.height / 2,
                    left: cartRect.left + cartRect.width / 2 - imgRect.width / 2,
                },
            });
        }

        if (!isSignedIn) {
            addToCart({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
            });
            return;
        }

        try {
            const res = await addToCartDB(product.id);

            if (res?.error) return;

            if (res?.item) {
                addToCart(res.item);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button
            onClick={handleAddToCart}
            className={clsx(
                "flex items-center justify-center gap-2 rounded-lg transition",
                {
                    "w-full md:w-fit px-5 py-3 bg-black text-white font-semibold":
                        variant === "default",

                    "w-full px-3 py-2 text-sm bg-black text-white font-semibold hover:bg-zinc-800":
                        variant === "card",
                }
            )}
        >
            <ShoppingCart size={18} />
            Add to cart
        </button>
    );
}