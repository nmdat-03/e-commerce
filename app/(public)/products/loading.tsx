import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container py-6">
            <div className="flex gap-6">

                {/* FILTER */}
                <div className="hidden lg:block w-1/4">
                    <Skeleton className="h-125 w-full bg-white rounded-xl" />
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-3/4 flex flex-col">

                    {/* Mobile filter */}
                    <div className="flex md:hidden mb-4">
                        <Skeleton className="h-10 w-32 rounded-md" />
                    </div>

                    {/* TOP BAR */}
                    <div className="flex items-center justify-between mb-4">

                        {/* Title */}
                        <Skeleton className="h-6 w-48" />

                        {/* SortBar Skeleton */}
                        <Skeleton className="h-8 w-35 rounded-md" />

                    </div>

                    {/* PRODUCT GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="bg-white p-3 rounded-xl shadow-md">
                                <Skeleton className="aspect-square w-full rounded-lg" />
                                <div className="mt-3 space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}