"use client";

import { motion, AnimatePresence } from "framer-motion";

type FlyingItem = {
    id: string;
    image: string;
    start: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
    end: {
        top: number;
        left: number;
    };
};

type Props = {
    items: FlyingItem[];
};

export default function FlyingCart({ items }: Props) {
    return (
        <AnimatePresence>
            {items.map((item) => (
                <motion.img
                    key={item.id}
                    src={item.image}
                    initial={{
                        position: "fixed",
                        top: item.start.top,
                        left: item.start.left,
                        width: item.start.width,
                        height: item.start.height,
                        zIndex: 9999,
                    }}
                    animate={{
                        top: item.end.top,
                        left: item.end.left,
                        scale: 0.2,
                        opacity: 0.5,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.8,
                        ease: [0.25, 0.8, 0.25, 1],
                    }}
                    className="pointer-events-none rounded-xl"
                />
            ))}
        </AnimatePresence>
    );
}