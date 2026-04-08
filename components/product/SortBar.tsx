"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function SortBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", value);

        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    return (
        <div className="flex items-center gap-2">
            {isPending && (
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            )}
            <select
                onChange={(e) => handleChange(e.target.value)}
                value={searchParams.get("sort") || "newest"}
                className="bg-white border shadow-md outline-none px-3 py-2 rounded-md text-sm"
            >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
            </select>


        </div>
    );
}