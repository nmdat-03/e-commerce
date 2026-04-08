"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
    categories: {
        id: string;
        name: string;
        slug: string;
    }[];
    brands: {
        id: string;
        name: string;
        slug: string;
    }[];
    onApply?: () => void;
};

export default function FilterSidebar({ categories, brands, onApply }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

    /*------------------------------*/
    /*      SYNC FROM URL           */
    /*------------------------------*/
    useEffect(() => {
        const categoryFromUrl = searchParams.get("category")?.split(",") || [];
        const brandFromUrl = searchParams.get("brands")?.split(",") || [];

        setSelectedCategories(categoryFromUrl);
        setSelectedBrands(brandFromUrl);
    }, [searchParams]);

    const toggleValue = (
        value: string,
        list: string[],
        setList: (v: string[]) => void
    ) => {
        if (list.includes(value)) {
            setList(list.filter((item) => item !== value));
        } else {
            setList([...list, value]);
        }
    };

    /*------------------------------*/
    /*          APPLY FILTER        */
    /*------------------------------*/
    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (selectedCategories.length > 0) {
            params.set("category", selectedCategories.join(","));
        } else {
            params.delete("category");
        }

        if (selectedBrands.length > 0) {
            params.set("brands", selectedBrands.join(","));
        } else {
            params.delete("brands");
        }

        router.push(`/products?${params.toString()}`);

        onApply?.();
    };

    /*------------------------------*/
    /*          RESET FILTER        */
    /*------------------------------*/
    const handleReset = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);

        const params = new URLSearchParams(searchParams.toString());
        params.delete("category");
        params.delete("brands");

        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="bg-white p-4 rounded-lg md:shadow-md space-y-6">
            <h2 className="font-semibold text-lg hidden md:flex">Filters</h2>

            {/* CATEGORY */}
            <div className="space-y-4">
                <p className="font-medium text-lg md:text-md">Category</p>
                <div className="flex flex-col gap-4">
                    {categories.map((item) => (
                        <label key={item.id} className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-black"
                                checked={selectedCategories.includes(item.slug)}
                                onChange={() =>
                                    toggleValue(item.slug, selectedCategories, setSelectedCategories)
                                }
                            />
                            {item.name}
                        </label>
                    ))}
                </div>

                <div className="border-t border-gray-300 my-3" />

                {/* BRAND */}
                <p className="font-medium mb-2 text-lg md:text-md">Brands</p>
                <div className="flex flex-col gap-4">
                    {brands.map((item) => (
                        <label key={item.id} className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-black"
                                checked={selectedBrands.includes(item.slug)}
                                onChange={() =>
                                    toggleValue(item.slug, selectedBrands, setSelectedBrands)
                                }
                            />
                            {item.name}
                        </label>
                    ))}
                </div>
            </div>

            {/* BUTTON */}
            <div className="flex gap-2 text-sm">
                <button
                    onClick={handleReset}
                    className="w-1/2 border border-black py-2 rounded-md"
                >
                    Reset
                </button>

                <button
                    onClick={handleApply}
                    className="w-1/2 bg-black text-white py-2 rounded-md"
                >
                    Apply
                </button>
            </div>
        </div>
    );
}
