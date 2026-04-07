"use client";

import { useEffect, useState } from "react";
import FilterSidebar from "./FilterSidebar";
import { Funnel, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileFilter() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <>
            {/* BUTTON */}
            <button
                onClick={() => setOpen(true)}
                className="lg:hidden border px-4 py-2 rounded-lg text-sm flex gap-2 items-center shadow-sm hover:bg-gray-50 transition"
            >
                <Funnel size={16} />
                Filter
            </button>

            {/* DRAWER */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* OVERLAY */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        />

                        {/* PANEL */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="fixed left-0 top-0 h-full w-[80%] max-w-sm bg-white z-50 shadow-xl p-4 flex flex-col"
                        >
                            {/* HEADER */}
                            <div className="flex items-center justify-between mb-4 border-b pb-2">
                                <h2 className="font-semibold text-lg">Filters</h2>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-2 rounded-md hover:bg-gray-100"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* CONTENT */}
                            <div className="overflow-y-auto">
                                <FilterSidebar />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}