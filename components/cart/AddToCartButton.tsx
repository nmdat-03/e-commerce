"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import clsx from "clsx";
import { addToCart as addToCartDB } from "@/server/actions/cart";
import { useUser } from "@clerk/nextjs";
import { useFly } from "@/components/providers/FlyProvider";
import { useTransition } from "react";

type Props = {
    product: {
        id: string;
        name: string;
        price: number;
        image?: string;
    };
    imgRef?: React.RefObject<HTMLElement | null>;
    disabled?: boolean;
};

export default function AddToCartButton({
    product,
    imgRef,
    disabled,
}: Props) {
    const addToCart = useCartStore((state) => state.addToCart);
    const { isSignedIn } = useUser();
    const { triggerFly } = useFly();
    const [isPending, startTransition] = useTransition();

    const handleAddToCart = () => {
        if (disabled || isPending) return;

        startTransition(async () => {
            try {
                const res = await addToCartDB(product.id);

                if (res?.error) return;

                if (res?.item) {
                    addToCart(res.item);
                }

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
                            top:
                                cartRect.top +
                                cartRect.height / 2 -
                                imgRect.height / 2,
                            left:
                                cartRect.left +
                                cartRect.width / 2 -
                                imgRect.width / 2,
                        },
                    });
                }
            } catch (error) {
                console.error(error);
            }
        });
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={disabled || isPending}
            className={clsx(
                "flex items-center justify-center gap-2 rounded-lg transition w-full md:w-fit px-5 py-3 font-semibold text-sm",
                disabled || isPending
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-black text-white hover:bg-zinc-800"
            )}
        >
            <ShoppingCart size={18} />
            {isPending ? "Adding..." : "Add to cart"}
        </button>
    );
}