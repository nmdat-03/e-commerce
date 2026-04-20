"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/format";
import { Eye, EyeOff, SquarePen } from "lucide-react";

export default function AdminProductsClient({ products }: { products: any[] }) {
    const [productList, setProductList] = useState(products);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === productList.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(productList.map((p) => p.id));
        }
    };

    const bulkUpdate = async (isActive: boolean) => {
        if (!selectedIds.length) return;
        setLoading(true);

        setProductList((prev) =>
            prev.map((p) =>
                selectedIds.includes(p.id) ? { ...p, isActive } : p
            )
        );

        try {
            await fetch("/api/admin/products/bulk", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds, isActive }),
            });
            setSelectedIds([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center gap-4 flex-wrap">
                <h1 className="text-2xl font-bold">Products</h1>

                <div className="flex gap-2 flex-wrap">
                    {productList.filter((p) => selectedIds.includes(p.id)).some((p) => !p.isActive) && (
                        <button
                            onClick={() => bulkUpdate(true)}
                            disabled={!selectedIds.length || loading}
                            className="px-4 py-2 border border-black rounded-lg flex gap-2 items-center text-sm disabled:opacity-50"
                        >
                            <Eye size={16} />
                            Show Selected
                        </button>
                    )}

                    {productList.filter((p) => selectedIds.includes(p.id)).some((p) => p.isActive) && (
                        <button
                            onClick={() => bulkUpdate(false)}
                            disabled={!selectedIds.length || loading}
                            className="px-4 py-2 border border-black rounded-lg flex gap-2 items-center text-sm disabled:opacity-50"
                        >
                            <EyeOff size={16} />
                            Hide Selected
                        </button>
                    )}

                    <Link
                        href="/admin/products/create"
                        className="px-4 py-2 bg-black text-white rounded-lg text-sm"
                    >
                        + Add Product
                    </Link>
                </div>
            </div>

            <div className="text-sm text-gray-500">
                {selectedIds.length} selected
            </div>

            <div className="border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-200">
                            <TableHead>
                                <input
                                    type="checkbox"
                                    checked={
                                        productList.length > 0 &&
                                        selectedIds.length === productList.length
                                    }
                                    onChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="bg-white">
                        {productList.map((product) => {
                            const image = product.images?.[0]?.url || "/placeholder.png";

                            return (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(product.id)}
                                            onChange={() => toggleSelect(product.id)}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={image}
                                                alt={product.name}
                                                width={50}
                                                height={50}
                                                className="rounded object-cover"
                                            />
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-xs text-gray-500">{product.slug}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>{formatPrice(product.price)}</TableCell>
                                    <TableCell>{product.category?.name || "-"}</TableCell>
                                    <TableCell>
                                        <StatusBadge active={product.isActive} />
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="px-3 py-1 text-sm border border-black rounded inline-flex gap-1 items-center"
                                        >
                                            <SquarePen size={16} />
                                            Edit
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function StatusBadge({ active }: { active: boolean }) {
    return (
        <span
            className={`px-2 py-1 text-xs rounded-full ${active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
                }`}
        >
            {active ? "ACTIVE" : "HIDDEN"}
        </span>
    );
}

