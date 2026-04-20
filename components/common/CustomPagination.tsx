"use client";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type Props = {
    currentPage: number;
    totalPages: number;
};

export default function CustomPagination({
    currentPage,
    totalPages,
}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    if (totalPages <= 1) return null;

    const createPageLink = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        return `${pathname}?${params.toString()}`;
    };

    const navigate = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;

        startTransition(() => {
            router.push(createPageLink(page), { scroll: false });
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const getPages = () => {
        const pages: (number | "...")[] = [];

        if (totalPages <= 7) {
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

    const disabledClass =
        "pointer-events-none opacity-50 cursor-not-allowed";

    return (
        <Pagination className="mt-6">
            <PaginationContent className="flex-wrap gap-1">
                {/* PREVIOUS */}
                <PaginationItem>
                    <PaginationPrevious
                        href={createPageLink(currentPage - 1)}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(currentPage - 1);
                        }}
                        className={
                            currentPage === 1 || isPending
                                ? disabledClass
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>

                {/* PAGE NUMBERS */}
                {pages.map((page, index) => (
                    <PaginationItem key={`${page}-${index}`}>
                        {page === "..." ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                href={createPageLink(page)}
                                isActive={page === currentPage}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(page);
                                }}
                                className={`
                                    min-w-9 cursor-pointer
                                    ${
                                        page === currentPage
                                            ? "bg-black text-white hover:bg-black hover:text-white"
                                            : ""
                                    }
                                    ${
                                        isPending
                                            ? "pointer-events-none opacity-70"
                                            : ""
                                    }
                                `}
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {/* NEXT */}
                <PaginationItem>
                    <PaginationNext
                        href={createPageLink(currentPage + 1)}
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(currentPage + 1);
                        }}
                        className={
                            currentPage === totalPages || isPending
                                ? disabledClass
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}