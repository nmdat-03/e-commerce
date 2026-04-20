"use client";

import { CldUploadWidget } from "next-cloudinary";

export default function UploadImages({
    images,
    onChange,
}: {
    images: any[];
    onChange: (images: any[]) => void;
}) {
    const handleSuccess = (result: any) => {
        const info = result?.info;
        if (!info?.secure_url) return;

        onChange([
            ...images,
            {
                url: info.secure_url,
                publicId: info.public_id,
            },
        ]);
    };

    return (
        <div className="space-y-3">
            <CldUploadWidget
                uploadPreset="e-commerce"
                onSuccess={handleSuccess}
            >
                {({ open }: { open: () => void }) => (
                    <button
                        type="button"
                        onClick={() => open()}
                        className="px-6 py-4 bg-gray-200 text-gray-500 rounded-lg"
                    >
                        +
                    </button>
                )}
            </CldUploadWidget>

            <div className="grid grid-cols-3 gap-3">
                {images.map((img, i) => (
                    <img
                        key={i}
                        src={img.url}
                        className="rounded-xl border"
                    />
                ))}
            </div>
        </div>
    );
}