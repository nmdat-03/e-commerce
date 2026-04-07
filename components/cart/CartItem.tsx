"use client";

import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

type CartItemType = {
    id: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
    selected: boolean;
};

type Props = {
    item: CartItemType;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
    onToggle: (id: string) => void;
};

function CartItem({
    item,
    onIncrease,
    onDecrease,
    onRemove,
    onToggle,
}: Props) {
    const { id, name, price, image, quantity, selected } = item;

    return (
        <div className="flex items-center justify-between border p-4 rounded-xl">
            {/* LEFT */}
            <div className="flex gap-3">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggle(id)}
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
                    <p className="text-sm text-gray-400">Qty: {quantity}</p>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onDecrease(id)}
                        disabled={quantity === 1}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md disabled:opacity-30"
                    >
                        <Minus size={12} />
                    </button>

                    <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md">
                        {quantity}
                    </span>

                    <button
                        onClick={() => onIncrease(id)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md"
                    >
                        <Plus size={12} />
                    </button>
                </div>

                <button
                    onClick={() => onRemove(id)}
                    className="flex items-center justify-center gap-1 border border-red-500 text-red-500 text-sm px-2 py-1 rounded-md hover:bg-red-500 hover:text-white transition"
                >
                    <Trash2 size={16} />
                    Remove
                </button>
            </div>
        </div>
    );
}

export default React.memo(CartItem);