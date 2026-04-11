"use client";

import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import clsx from "clsx";

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
        <div className="flex items-center justify-between border p-4 rounded-xl">
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
                    <p className="font-semibold">{name}</p>
                    <p className="text-gray-600">${price}</p>
                    <p className="text-sm text-gray-400">
                        Qty: {quantity}
                    </p>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-3">
                {/* QUANTITY */}
                <div className="flex items-center gap-2">
                    {/* DECREASE */}
                    <button
                        onClick={() => onDecrease(id)}
                        disabled={loading || quantity === 1}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md disabled:opacity-30 cursor-not-allowed"
                    >
                        <Minus size={12} />
                    </button>

                    {/* VALUE */}
                    <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md">
                        {quantity}
                    </span>

                    {/* INCREASE */}
                    <button
                        onClick={() => onIncrease(id)}
                        disabled={
                            loading ||
                            (stock !== undefined && quantity >= stock)
                        }
                        className={clsx(
                            "w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md",
                            loading ||
                                (stock !== undefined &&
                                    quantity >= stock)
                                ? "opacity-30 cursor-not-allowed"
                                : "hover:bg-gray-200"
                        )}
                    >
                        <Plus size={12} />
                    </button>
                </div>

                {/* REMOVE */}
                <button
                    onClick={() => onRemove(id)}
                    disabled={loading}
                    className={clsx(
                        "flex items-center justify-center gap-1 border text-sm px-2 py-1 rounded-md transition",
                        loading
                            ? "border-gray-300 text-gray-400 cursor-not-allowed"
                            : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    )}
                >
                    <Trash2 size={16} />
                    Remove
                </button>
            </div>
        </div>
    );
}

export default React.memo(CartItem);