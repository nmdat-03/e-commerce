import { Skeleton } from "@/components/ui/skeleton";

export default function CartSkeleton() {
    return (
        <div className="container py-5">
            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-6">
                {/* TITLE */}
                <Skeleton className="h-7 w-40" />

                {/* SELECT ALL */}
                <div className="flex items-center gap-2">
                    <Skeleton className="w-5 h-5 rounded" />
                    <Skeleton className="h-4 w-24" />
                </div>

                {/* LIST */}
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-4 border rounded-xl"
                        >
                            <div className="flex items-center gap-3">
                                {/* checkbox */}
                                <Skeleton className="w-5 h-5 rounded" />

                                {/* image */}
                                <Skeleton className="w-20 h-20 rounded-lg" />

                                {/* content */}
                                <div className="flex flex-col gap-1">
                                    <Skeleton className="h-4 w-60" />
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                {/* Quantity */}
                                <div className="flex items-center gap-2">
                                    <Skeleton className="w-8 h-8 rounded-md" />
                                    <Skeleton className="w-8 h-8 rounded-md" />
                                    <Skeleton className="w-8 h-8 rounded-md" />
                                </div>

                                {/* Remove */}
                                <Skeleton className="h-7 w-28 rounded-md" />
                            </div>

                        </div>
                    ))}
                </div>

                {/* TOTAL */}
                <div className="flex justify-between items-center border-t pt-4">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-6 w-24" />
                </div>

                {/* CHECKOUT */}
                <Skeleton className="h-12 w-full rounded-lg" />
            </div>
        </div>
    );
}