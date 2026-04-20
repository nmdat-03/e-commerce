export default function ProductDetailSkeleton() {
    return (
        <div className="space-y-2">
            {/* Top buttons */}
            <div className="flex justify-between">
                <div className="h-9 w-24 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-9 w-60 bg-gray-200 rounded-full animate-pulse" />
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 space-y-6 animate-pulse">
                {/* Breadcrumb */}
                <div className="h-4 w-1/3 bg-gray-200 rounded" />

                {/* Main content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    {/* Image gallery */}
                    <div className="h-75 md:h-100 bg-gray-200 rounded-xl" />

                    {/* Info */}
                    <div className="space-y-4 md:space-y-5">
                        {/* Product name */}
                        <div className="h-6 w-3/4 bg-gray-200 rounded" />

                        {/* Price */}
                        <div className="h-6 w-1/3 bg-gray-200 rounded" />

                        {/* Add to cart */}
                        <div className="h-10 w-40 bg-gray-200 rounded-xl" />
                    </div>
                </div>

                {/* Description */}
                <div className="mt-10 border-t border-gray-300 pt-6 space-y-3">
                    <div className="h-5 w-32 bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );
}