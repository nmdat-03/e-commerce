"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

type Suggestion = {
    id: string;
    name: string;
    price: number;
    slug: string;
    image: string | null;
};

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showLoading, setShowLoading] = useState(false);

    /*---------------------------------*/
    /*   DELAY SHOW SKELETON           */
    /*---------------------------------*/
    useEffect(() => {
        if (!loading) {
            setShowLoading(false);
            return;
        }

        const t = setTimeout(() => setShowLoading(true), 150);
        return () => clearTimeout(t);
    }, [loading]);

    /*---------------------------------*/
    /*      SYNC URL → INPUT           */
    /*---------------------------------*/
    useEffect(() => {
        setValue(searchParams.get("q") || "");
    }, [searchParams]);

    /*---------------------------------*/
    /*         FETCH SUGGESTIONS       */
    /*---------------------------------*/
    useEffect(() => {
        const timeout = setTimeout(async () => {
            if (!value || value.length < 2) {
                setSuggestions([]);
                setOpen(false);
                return;
            }

            setLoading(true);
            setOpen(true);

            try {
                const res = await fetch(`/api/search?q=${value}`);
                const data = await res.json();

                setSuggestions(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [value]);

    /*---------------------------------*/
    /*      CLICK OUTSIDE              */
    /*---------------------------------*/
    useEffect(() => {
        const handleClickOutside = (e: any) => {
            if (!e.target.closest(".search-box")) {
                setOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () =>
            document.removeEventListener("click", handleClickOutside);
    }, []);

    /*---------------------------------*/
    /*      RESET INDEX                */
    /*---------------------------------*/
    useEffect(() => {
        setSelectedIndex(-1);
    }, [value]);

    /*---------------------------------*/
    /*          HANDLE SEARCH          */
    /*---------------------------------*/
    const handleSearch = () => {
        if (!value) return;
        router.push(`/products?q=${value}`);
        setOpen(false);
    };

    return (
        <div className="relative w-full max-w-md search-box">
            {/* ICON */}
            <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            {/* INPUT */}
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => value && setOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();

                        if (open && selectedIndex >= 0) {
                            const item = suggestions[selectedIndex];
                            router.push(`/product/${item.slug}`);
                        } else {
                            handleSearch();
                        }

                        setOpen(false);
                    }

                    if (!open) return;

                    if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setSelectedIndex((prev) =>
                            prev < suggestions.length - 1 ? prev + 1 : 0
                        );
                    }

                    if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setSelectedIndex((prev) =>
                            prev > 0 ? prev - 1 : suggestions.length - 1
                        );
                    }
                }}
                placeholder="Search products..."
                className="w-full border-2 border-black pl-10 pr-4 py-2 rounded-full outline-none text-sm"
            />

            {/* DROPDOWN */}
            {open && (
                <div
                    className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-2 z-50 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
                >
                    {/* LOADING */}
                    {showLoading ? (
                        <div className="p-3 space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="w-12 h-12 rounded-md" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-3 w-3/4" />
                                        <Skeleton className="h-3 w-1/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : suggestions.length > 0 ? (
                        <>
                            {suggestions.map((item, index) => (
                                <div
                                    key={item.id}
                                    ref={(el) => {
                                        if (selectedIndex === index && el) {
                                            el.scrollIntoView({
                                                block: "nearest",
                                            });
                                        }
                                    }}
                                    onMouseEnter={() =>
                                        setSelectedIndex(index)
                                    }
                                    onClick={() => {
                                        router.push(`/product/${item.slug}`);
                                        setOpen(false);
                                    }}
                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer
                                        ${selectedIndex === index
                                            ? "bg-gray-100"
                                            : "hover:bg-gray-100"
                                        }
                                    `}
                                >
                                    {/* IMAGE */}
                                    <div className="w-12 h-12 relative bg-gray-100 rounded-md overflow-hidden shrink-0">
                                        {item.image && (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>

                                    {/* INFO */}
                                    <div className="flex flex-col">
                                        <span className="text-sm line-clamp-1">
                                            {item.name}
                                        </span>
                                        <span className="text-sm font-semibold text-black">
                                            ${item.price.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {/* VIEW ALL */}
                            <div
                                onClick={() => {
                                    router.push(`/products?q=${value}`);
                                    setOpen(false);
                                }}
                                className="px-4 py-2 text-sm text-blue-500 hover:bg-gray-100 cursor-pointer"
                            >
                                See all results for "{value}"
                            </div>
                        </>
                    ) : (
                        <div className="p-4 text-sm text-gray-500">
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}