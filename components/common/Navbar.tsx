"use client";

import Link from "next/link";
import { LogOut, Menu, Package, Search, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import UserMenu from "./UserMenu";
import SearchBar from "./SearchBar";
import CustomButton from "./CustomButton";

const menuItems = [
    { label: "Products", href: "/products" },
    { label: "Contact", href: "/contact" },
];

export default function Navbar() {

    const [isOpen, setIsOpen] = useState(false);

    const [showSearch, setShowSearch] = useState(false)

    const { isSignedIn, isLoaded } = useUser();

    const totalItems = useCartStore((state) => state.getTotalItems());

    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/20 shadow-sm">
            <div className="container mx-auto flex items-center justify-between py-4">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold">
                    MyStore
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative text-zinc-700 hover:text-black transition group"
                        >
                            {item.label}

                            <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Search Bar */}
                <div className="hidden md:flex w-75 lg:w-100 xl:w-125">
                    <SearchBar />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-5">
                    <button
                        className="md:hidden"
                        onClick={() => {
                            setShowSearch((prev) => !prev)
                            setIsOpen(false)
                        }}
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    {/* Cart */}
                    <Link
                        href="/cart"
                        id="cart-icon"
                        className="relative p-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        <motion.div
                            animate={{ scale: totalItems ? [1, 1.2, 1] : 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ShoppingCart size={20} />
                        </motion.div>
                        {hydrated && totalItems > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-black text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                                {totalItems > 99 ? "99+" : totalItems}
                            </span>
                        )}
                    </Link>

                    {/* Desktop Login */}
                    {isLoaded && !isSignedIn && (
                        <div className="hidden md:flex items-center gap-2">
                            <SignInButton mode="modal">
                                <CustomButton className="px-4 py-2 border-2 rounded-lg border-black bg-black text-white text-sm font-semibold">
                                    Login
                                </CustomButton>
                            </SignInButton>
                        </div>
                    )}

                    {isLoaded && isSignedIn && (
                        <div className="hidden md:flex">
                            <UserMenu />
                        </div>
                    )}


                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => {
                            setIsOpen(!isOpen)
                            setShowSearch(false)
                        }}
                        className="md:hidden p-2"
                    >
                        <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isOpen ? <X /> : <Menu />}
                        </motion.div>
                    </button>
                </div>

                {/* Mobile Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute right-2 top-full mt-2 w-44 bg-white border rounded-xl shadow-lg md:hidden origin-top"
                        >
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={{
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.06,
                                        },
                                    },
                                }}
                                className="flex flex-col p-4 gap-3"
                            >
                                {menuItems.map((item) => (
                                    <motion.div
                                        key={item.href}
                                        variants={{
                                            hidden: { opacity: 0, y: -5 },
                                            visible: { opacity: 1, y: 0 },
                                        }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="text-black"
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                ))}

                                <div className="h-px bg-gray-300 my-2" />

                                {!isSignedIn && isLoaded && (
                                    <motion.div
                                        variants={{
                                            hidden: { opacity: 0, y: -5 },
                                            visible: { opacity: 1, y: 0 },
                                        }}
                                        className="flex flex-col gap-3"
                                    >
                                        <SignInButton mode="modal">
                                            <button
                                                onClick={() => setIsOpen(false)}
                                                className="px-3 py-2 border rounded-lg bg-black text-white text-sm"
                                            >
                                                Login
                                            </button>
                                        </SignInButton>
                                    </motion.div>
                                )}

                                {isSignedIn && isLoaded && (
                                    <motion.div
                                        variants={{
                                            hidden: { opacity: 0, y: -5 },
                                            visible: { opacity: 1, y: 0 },
                                        }}
                                        className="flex flex-col gap-3"
                                    >
                                        <Link
                                            href="/orders"
                                            onClick={() => setIsOpen(false)}
                                            className="flex gap-2 items-center text-black"
                                        >
                                            <Package size={18} />
                                            My Orders
                                        </Link>

                                        <SignOutButton>
                                            <button
                                                onClick={() => setIsOpen(false)}
                                                className="flex gap-2 items-center text-red-500"
                                            >
                                                <LogOut size={18} />
                                                Logout
                                            </button>
                                        </SignOutButton>
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25 }}
                        className="md:hidden px-4 py-3"
                    >
                        <SearchBar />
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
