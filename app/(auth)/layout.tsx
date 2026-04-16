"use client";

import { useRouter } from "next/navigation";
import CustomButton from "@/components/common/CustomButton";
import { House } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
            {/* BACK BUTTON */}
            <div className="absolute top-4 left-4">
                <CustomButton
                    onClick={() => router.push("/")}
                    className="text-sm px-4 py-2 rounded-full shadow-md bg-white flex items-center gap-1"
                >
                    <House size={14} />
                    Home
                </CustomButton>
            </div>

            {/* CONTENT */}
            {children}
        </div>
    );
}