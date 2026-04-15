import Image from "next/image";
import Link from "next/link";

type Brand = {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
};

export default function BrandSection({ brands }: { brands: Brand[] }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {brands.map((brand) => (
                <Link
                    key={brand.id}
                    href={`/products?brand=${brand.slug}`}
                    className="bg-white p-3 rounded-xl shadow-md flex flex-col items-center justify-center gap-2 hover:scale-105 transition"
                >
                    {brand.logo ? (
                        <Image
                            src={brand.logo}
                            alt={brand.name}
                            width={80}
                            height={80}
                            className="object-contain rounded-md"
                        />
                    ) : (
                        <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-md">
                            <span className="text-xs text-gray-500">No logo</span>
                        </div>
                    )}

                    <p className="text-sm font-medium text-center">
                        {brand.name}
                    </p>
                </Link>
            ))}
        </div>
    );
}