import { Skeleton } from "@/components/ui/skeleton";

export default function ProductListSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white p-3 rounded-xl shadow-md"
                >
                    {/* Image */}
                    <Skeleton className="aspect-square w-full rounded-lg" />

                    {/* Info */}
                    <div className="mt-3 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}