"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/store/cart-store";
import { mergeCart, getCart } from "@/server/actions/cart";

export default function CartSync() {
    const { isSignedIn } = useUser();
    const setCart = useCartStore((state) => state.setCart);

    const wasSignedIn = useRef<boolean | null>(null);
    const isSyncing = useRef(false);

    useEffect(() => {
        const isLoggedIn = !!isSignedIn;

        const sync = async () => {
            if (isSyncing.current) return;
            isSyncing.current = true;

            try {
                const store = useCartStore.getState();
                const items = store.items;
                const clearCart = store.clearCart;

                if (wasSignedIn.current === false && isLoggedIn && items.length > 0) {
                    await mergeCart(items);

                    const dbCart = await getCart();
                    setCart(dbCart);

                    clearCart();
                }

                else if (isLoggedIn) {
                    const dbCart = await getCart();
                    setCart(dbCart);
                }

                else if (!isLoggedIn) {
                    clearCart();
                }
            } catch (error) {
                console.error("Cart sync error:", error);
            } finally {
                isSyncing.current = false;
                wasSignedIn.current = isLoggedIn;
            }
        };

        sync();
    }, [isSignedIn, setCart]);

    return null;
}