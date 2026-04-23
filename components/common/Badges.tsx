"use client";

import {
    OrderStatus,
    PaymentStatus,
} from "@prisma/client";

type BadgeProps = {
    className: string;
    label: string;
};

function Badge({
    className,
    label,
}: BadgeProps) {
    return (
        <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${className}`}
        >
            {label}
        </span>
    );
}

/* ---------------- ORDER ---------------- */

export function OrderStatusBadge({
    status,
}: {
    status: OrderStatus;
}) {
    const map: Record<
        OrderStatus,
        { label: string; className: string }
    > = {
        PENDING: {
            label: "PENDING",
            className:
                "bg-yellow-100 text-yellow-700",
        },
        CONFIRMED: {
            label: "CONFIRMED",
            className:
                "bg-blue-100 text-blue-700",
        },
        SHIPPING: {
            label: "SHIPPING",
            className:
                "bg-purple-100 text-purple-700",
        },
        COMPLETED: {
            label: "COMPLETED",
            className:
                "bg-green-100 text-green-700",
        },
        CANCELLED: {
            label: "CANCELLED",
            className:
                "bg-red-100 text-red-700",
        },
    };

    return (
        <Badge
            label={map[status].label}
            className={map[status].className}
        />
    );
}

/* ---------------- PAYMENT ---------------- */

export function PaymentStatusBadge({
    status,
}: {
    status: PaymentStatus;
}) {
    const map: Record<
        PaymentStatus,
        { label: string; className: string }
    > = {
        PENDING: {
            label: "PENDING",
            className:
                "bg-yellow-100 text-yellow-700",
        },
        PAID: {
            label: "PAID",
            className:
                "bg-green-100 text-green-700",
        },
        FAILED: {
            label: "FAILED",
            className:
                "bg-red-100 text-red-700",
        },
        REFUNDED: {
            label: "REFUNDED",
            className:
                "bg-gray-200 text-gray-700",
        },
    };

    return (
        <Badge
            label={map[status].label}
            className={map[status].className}
        />
    );
}