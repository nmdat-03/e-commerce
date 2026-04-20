import { Suspense } from "react";
import ProductsContent from "./ProductsContent";

export default function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{
        q?: string;
        sort?: string;
        category?: string;
        page?: string;
    }>;
}) {
    return (
        <div className="container py-6">
            <Suspense fallback={null}>
                <ProductsContent searchParams={searchParams} />
            </Suspense>
        </div>
    );
}