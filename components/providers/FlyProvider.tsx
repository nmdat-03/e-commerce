"use client";

import { createContext, useContext, useState } from "react";
import FlyingCart from "@/components/cart/FlyingToCart";

const FlyContext = createContext<any>(null);

export const useFly = () => useContext(FlyContext);

export default function FlyProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<any[]>([]);

    const triggerFly = (item: any) => {
        setItems((prev) => [...prev, item]);

        setTimeout(() => {
            setItems((prev) => prev.filter((i) => i.id !== item.id));
        }, 800);
    };

    return (
        <FlyContext.Provider value={{ triggerFly }}>
            {children}
            <FlyingCart items={items} />
        </FlyContext.Provider>
    );
}