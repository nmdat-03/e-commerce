"use client";

import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import {
    removeCartItem,
    increaseCartItem,
    decreaseCartItem,
} from "@/server/actions/cart";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CartItem from "@/components/cart/CartItem";
import CustomButton from "@/components/common/CustomButton";
import CartSkeleton from "@/components/skeletons/CartSkeleton";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
    const {
        items,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        totalPrice,
        toggleSelect,
        toggleSelectAll,
        updateItem,
    } = useCart();

    const router = useRouter();
    const { isSignedIn } = useUser();

    const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
    const [showLoginModal, setShowLoginModal] = useState(false);

    /* ---------------- SKELETON ---------------- */
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    /* ---------------- SELECT ---------------- */
    const allSelected = useMemo(
        () => items.length > 0 && items.every((item) => item.selected),
        [items]
    );

    const selectedItems = useMemo(
        () => items.filter((item) => item.selected),
        [items]
    );

    if (!hydrated) {
        return <CartSkeleton />;
    }

    const setLoading = (id: string, value: boolean) => {
        setLoadingIds((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    /* ---------------- ACTIONS ---------------- */
    const handleRemove = async (id: string) => {
        if (loadingIds[id]) return;

        try {
            setLoading(id, true);

            if (isSignedIn) {
                const res = await removeCartItem(id);
                if (res?.error) return;
            }

            removeFromCart(id);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(id, false);
        }
    };

    const handleIncrease = async (id: string) => {
        if (loadingIds[id]) return;

        try {
            setLoading(id, true);

            if (isSignedIn) {
                const res = await increaseCartItem(id);

                if (res?.error) return;

                if (res?.success) {
                    updateItem(res.item);
                    return;
                }
            } else {
                increaseQuantity(id);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(id, false);
        }
    };

    const handleDecrease = async (id: string) => {
        if (loadingIds[id]) return;

        try {
            setLoading(id, true);

            if (isSignedIn) {
                const res = await decreaseCartItem(id);

                if (res?.error) return;

                if (res?.success) {
                    updateItem(res.item);
                    return;
                }
            } else {
                decreaseQuantity(id);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(id, false);
        }
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) return;

        if (!isSignedIn) {
            setShowLoginModal(true);
            return;
        }

        router.push("/checkout");
    };

    /* ---------------- EMPTY ---------------- */
    if (items.length === 0) {
        return (
            <div className="container py-5">
                <div className="bg-white rounded-2xl shadow-md p-4 space-y-6">
                    <h1 className="text-2xl font-bold">Your Cart</h1>
                    <p className="flex justify-center italic text-gray-400">
                        Your cart is empty
                    </p>
                </div>
            </div>
        );
    }

    /* ---------------- UI ---------------- */
    return (
        <div className="container py-5">
            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-6">
                <h1 className="text-2xl font-bold">Your Cart</h1>

                {/* SELECT ALL */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="w-5 h-5 accent-black"
                    />
                    <span>Select all</span>
                </div>

                {/* LIST */}
                <div className="space-y-4">
                    {items.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                            onRemove={handleRemove}
                            onToggle={toggleSelect}
                            loading={!!loadingIds[item.id]}
                        />
                    ))}
                </div>

                {/* TOTAL */}
                <div className="flex justify-between items-center border-t pt-4">
                    <p className="text-lg font-semibold">Total:</p>
                    <p className="text-xl font-bold">{formatPrice(totalPrice)}</p>
                </div>

                {/* CHECKOUT */}
                <CustomButton
                    disabled={selectedItems.length === 0}
                    onClick={handleCheckout}
                    className="w-full bg-black text-white py-3 rounded-lg disabled:opacity-50"
                >
                    Checkout
                </CustomButton>
            </div>

            {/* LOGIN MODAL */}
            <AnimatePresence>
                {showLoginModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl p-6 w-[90%] max-w-md text-center space-y-4"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            <h2 className="text-xl font-bold">
                                You need to login
                            </h2>

                            <p className="text-gray-500">
                                Please login to continue checkout
                            </p>

                            <div className="flex gap-3 pt-2">
                                <CustomButton
                                    onClick={() => setShowLoginModal(false)}
                                    className="flex-1 border border-black py-2 rounded-lg hover:bg-gray-100"
                                >
                                    Back
                                </CustomButton>

                                <SignInButton mode="modal">
                                    <CustomButton className="flex-1 bg-black text-white py-2 rounded-lg">
                                        Login
                                    </CustomButton>
                                </SignInButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}