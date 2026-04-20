"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function UpdateOrderButton({
    id,
    status,
    onRequireConfirm,
}: {
    id: string;
    status: string;
    onRequireConfirm?: (id: string, status: string) => void;
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const needConfirm = status === "CANCELLED" || status === "COMPLETED";

    const handleClick = () => {
        if (needConfirm && onRequireConfirm) {
            onRequireConfirm(id, status);
            return;
        }

        startTransition(async () => {
            await fetch(`/api/admin/orders/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ orderStatus: status }),
            });

            router.refresh();
        });
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className="px-3 py-1 bg-black text-white rounded"
        >
            {status}
        </button>
    );
}