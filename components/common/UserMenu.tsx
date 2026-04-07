"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { LogOut, User, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function UserMenu() {
    const { signOut } = useClerk();
    const { user } = useUser();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setHoveredIndex(null);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const menuItems = [
        {
            label: "Profile",
            icon: User,
            href: "/profile",
        },
        {
            label: "My Orders",
            icon: Package,
            href: "/orders",
        },
    ];

    return (
        <div className="relative" ref={ref}>
            {/* Avatar */}
            <motion.img
                src={user?.imageUrl || "/default-avatar.png"}
                className="w-8 h-8 rounded-full cursor-pointer object-cover border"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setOpen(!open)}
            />

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-lg z-50 origin-top border"
                    >
                        {/* Header */}
                        <div className="p-3 border-b text-sm font-medium">
                            {user?.username || "User"}
                        </div>

                        {/* Menu */}
                        <div className="relative py-1">
                            {/* Hover background */}
                            <AnimatePresence>
                                {hoveredIndex !== null && (
                                    <motion.div
                                        layoutId="hover-bg"
                                        className="absolute left-1 right-1 h-9 bg-gray-100 rounded-lg"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        style={{
                                            top: hoveredIndex * 36 + 4,
                                        }}
                                    />
                                )}
                            </AnimatePresence>

                            {/* Items */}
                            {menuItems.map((item, index) => {
                                const Icon = item.icon;

                                return (
                                    <button
                                        key={index}
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                        onClick={() => {
                                            router.push(item.href);
                                            setOpen(false);
                                        }}
                                        className="relative z-10 w-full flex items-center gap-2 px-4 py-2 text-sm"
                                    >
                                        <Icon size={16} />
                                        {item.label}
                                    </button>
                                );
                            })}

                            {/* Logout */}
                            <button
                                onMouseEnter={() => setHoveredIndex(menuItems.length)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => signOut({ redirectUrl: "/" })}
                                className="relative z-10 w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}