"use client";

import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import clsx from "clsx";
import { formatPrice } from "@/lib/format";

type CartItemType = {
    id: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
    selected: boolean;
    stock?: number;
};

type Props = {
    item: CartItemType;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
    onToggle: (id: string) => void;
    loading?: boolean;
};

function CartItem({
    item,
    onIncrease,
    onDecrease,
    onRemove,
    onToggle,
    loading = false,
}: Props) {
    const { id, name, price, image, quantity, selected, stock } = item;

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border p-4 rounded-xl gap-4">
            {/* LEFT */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggle(id)}
                    disabled={loading}
                    className="w-5 h-5 accent-black"
                />

                <Image
                    src={image || "/no-image.png"}
                    alt={name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                />

                <div className="flex flex-col gap-1">
                    <p className="font-semibold truncate max-w-45 md:max-w-none">
                        {name}
                    </p>

                    <p className="text-gray-600">{formatPrice(price)}</p>

                    <p className="text-sm text-gray-400">
                        x{quantity}
                    </p>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center justify-between md:flex-col md:items-end gap-3 w-full md:w-auto">
                {/* REMOVE */}
                <button
                    onClick={() => onRemove(id)}
                    disabled={loading}
                    className={clsx(
                        "order-1 md:order-2 flex items-center justify-center gap-1 text-sm px-3 py-2 rounded-md transition md:w-full",
                        loading
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                    )}
                >
                    <Trash2 size={16} />
                    Remove
                </button>

                {/* QUANTITY */}
                <div className="order-2 md:order-1 flex items-center gap-2">
                    <button
                        onClick={() => onDecrease(id)}
                        disabled={loading || quantity === 1}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md disabled:opacity-30 cursor-not-allowed"
                    >
                        <Minus size={12} />
                    </button>

                    <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md">
                        {quantity}
                    </span>

                    <button
                        onClick={() => onIncrease(id)}
                        disabled={
                            loading ||
                            (stock !== undefined && quantity >= stock)
                        }
                        className={clsx(
                            "w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md",
                            loading ||
                                (stock !== undefined && quantity >= stock)
                                ? "opacity-30 cursor-not-allowed"
                                : "hover:bg-gray-200"
                        )}
                    >
                        <Plus size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default React.memo(CartItem);