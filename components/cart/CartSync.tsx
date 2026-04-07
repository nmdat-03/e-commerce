"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/store/cart-store";
import { mergeCart, getCart } from "@/server/actions/cart";

export default function CartSync() {
    const { isSignedIn } = useUser();
    const setCart = useCartStore((state) => state.setCart);

    const wasSignedIn = useRef(false);

    useEffect(() => {
        const isLoggedIn = !!isSignedIn;


        const sync = async () => {
            const { items, clearCart } = useCartStore.getState();

            try {
                if (!wasSignedIn.current && isLoggedIn && items.length > 0) {
                    await mergeCart(items);
                    clearCart();
                }

                if (isLoggedIn) {
                    const dbCart = await getCart();
                    setCart(dbCart);
                }
            } catch (error) {
                console.error("Cart sync error:", error);
            }

            wasSignedIn.current = isLoggedIn;
        };

        sync();


    }, [isSignedIn, setCart]);

    return null;
}
