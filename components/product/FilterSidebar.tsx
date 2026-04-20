"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CustomButton from "../common/CustomButton";
import clsx from "clsx";

type Props = {
    categories: {
        id: string;
        name: string;
        slug: string;
    }[];
    onApply?: () => void;
};

export default function FilterSidebar({ categories, onApply }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const isEmpty = selectedCategories.length === 0;

    /*------------------------------*/
    /*      SYNC FROM URL           */
    /*------------------------------*/
    useEffect(() => {
        const categoryFromUrl = searchParams.get("category")?.split(",") || [];
        setSelectedCategories(categoryFromUrl);
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

        params.set("page", "1")

        startTransition(() => {
            router.push(`/products?${params.toString()}`);
        });

        onApply?.();
    };

    /*------------------------------*/
    /*          RESET FILTER        */
    /*------------------------------*/
    const handleReset = () => {
        setSelectedCategories([]);

        const params = new URLSearchParams(searchParams.toString());
        params.delete("category");
        params.set("page", "1")

        startTransition(() => {
            router.push(`/products?${params.toString()}`);
        });
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

            </div>

            {/* BUTTON */}
            <div className="flex gap-2 text-sm">
                <CustomButton
                    onClick={handleReset}
                    disabled={isEmpty || isPending}
                    className={clsx(
                        "w-1/2 border border-black py-2 rounded-md",
                        (isEmpty || isPending) && "opacity-50 pointer-events-none"
                    )}
                >
                    Reset
                </CustomButton>

                <CustomButton
                    onClick={handleApply}
                    disabled={isPending}
                    className={clsx(
                        "w-1/2 bg-black text-white py-2 rounded-md flex items-center justify-center gap-2",
                        isPending && "opacity-70 pointer-events-none"
                    )}
                >
                    {isPending && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    Apply
                </CustomButton>
            </div>
        </div>
    );
}
