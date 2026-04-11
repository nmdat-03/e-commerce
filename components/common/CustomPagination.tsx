"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
    currentPage: number;
    totalPages: number;
};

export default function CustomPagination({
    currentPage,
    totalPages,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const createPageLink = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        return `?${params.toString()}`;
    };

    const handleNavigate = (page: number) => {
        router.push(createPageLink(page));

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });


    };

    if (totalPages <= 1) return null;

    const getPages = () => {
        const pages: (number | "...")[] = [];


        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        pages.push(1);

        if (currentPage > 3) {
            pages.push("...");
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push("...");
        }

        pages.push(totalPages);

        return pages;
    };

    const pages = getPages();

    return (
        <Pagination className="mt-6">
            <PaginationContent>

                {/* PREVIOUS */}
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() =>
                            currentPage > 1 && handleNavigate(currentPage - 1)
                        }
                        className={
                            currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>

                {/* PAGE NUMBERS */}
                {pages.map((page, index) => (
                    <PaginationItem key={index}>
                        {page === "..." ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                isActive={page === currentPage}
                                onClick={() => handleNavigate(page)}
                                className={`cursor-pointer 
                                ${page === currentPage
                                        ? "bg-black text-white hover:bg-black hover:text-white"
                                        : "bg-white hover:bg-white/70"
                                    }`
                                }
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {/* NEXT */}
                <PaginationItem>
                    <PaginationNext
                        onClick={() =>
                            currentPage < totalPages &&
                            handleNavigate(currentPage + 1)
                        }
                        className={
                            currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>

            </PaginationContent>
        </Pagination>


    );
}
