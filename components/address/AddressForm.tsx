"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, AddressInput } from "@/lib/validators/address";
import { useEffect } from "react";
import CustomButton from "../common/CustomButton";

type Address = {
    id: string;
    fullName: string;
    phone: string;
    address: string;
    isDefault: boolean;
};

type Props = {
    onSuccess: (data: Address) => void;
    onCancel?: () => void;
    initialData?: Address;
};

export default function AddressForm({ onSuccess, onCancel, initialData }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<AddressInput>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            fullName: initialData?.fullName || "",
            phone: initialData?.phone || "",
            address: initialData?.address || "",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                fullName: initialData.fullName,
                phone: initialData.phone,
                address: initialData.address,
            });
        }
    }, [initialData, reset]);

    const onSubmit = async (data: AddressInput) => {
        try {
            if (initialData) {
                const res = await fetch(`/api/addresses/${initialData.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (!res.ok) {
                    alert("Failed to update address");
                    return;
                }

                const updated = await res.json();
                onSuccess(updated);
            } else {
                const res = await fetch("/api/addresses", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (!res.ok) {
                    alert("Failed to create address");
                    return;
                }

                const newAddress = await res.json();
                onSuccess(newAddress);
            }

            reset();
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3 border border-gray-400 p-3 rounded-lg"
        >
            <div>
                <input
                    {...register("fullName")}
                    placeholder="Full Name"
                    className="w-full border p-2 rounded"
                />
                {errors.fullName && (
                    <p className="text-red-500 text-sm">
                        {errors.fullName.message}
                    </p>
                )}
            </div>

            <div>
                <input
                    {...register("phone")}
                    placeholder="Phone"
                    className="w-full border p-2 rounded"
                />
                {errors.phone && (
                    <p className="text-red-500 text-sm">
                        {errors.phone.message}
                    </p>
                )}
            </div>

            <div>
                <input
                    {...register("address")}
                    placeholder="Address"
                    className="w-full border p-2 rounded"
                />
                {errors.address && (
                    <p className="text-red-500 text-sm">
                        {errors.address.message}
                    </p>
                )}
            </div>

            <div className="flex gap-2 justify-end">
                <CustomButton
                    type="button"
                    onClick={onCancel}
                    className="text-black px-2 py-1 border border-black rounded text-md"
                >
                    Cancel
                </CustomButton>
                <CustomButton
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-black text-white px-2 py-1 rounded text-md"
                >
                    {isSubmitting
                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : initialData
                            ? "Update Address"
                            : "Save Address"}
                </CustomButton>
            </div>
        </form>
    );
}