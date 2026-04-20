"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField, SelectField, TextareaField } from "../common/FormField";
import UploadImages from "../common/UploadImages";
import CustomButton from "../common/CustomButton";
import { ProductFormValues, productSchema, ProductSubmitValues } from "../../lib/validators/product";


export default function ProductForm({
    categories,
    product,
    isEdit = false,
}: {
    categories: any[];
    product?: any;
    isEdit?: boolean;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const slugify = (text: string) =>
        text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product?.name || "",
            price: product?.price || "",
            description: product?.description || "",
            categoryId: product?.categoryId || "",
            images: product?.images || [],
        },
    });

    const images = watch("images");

    const onSubmit = async (data: ProductFormValues) => {
        setLoading(true);

        try {
            const parsed: ProductSubmitValues = productSchema.parse(data);

            const payload = {
                ...parsed,
                slug: slugify(parsed.name),
                categoryId: parsed.categoryId || null,
            };

            const url = isEdit
                ? `/api/admin/products/${product.id}`
                : "/api/admin/products";

            const method = isEdit ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                alert("Save failed");
                setLoading(false);
                return;
            }

            router.push("/admin/products");
            router.refresh();
        } catch {
            alert("Something went wrong");
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-2xl bg-white border rounded-2xl p-6 space-y-5"
        >
            <div>
                <label className="block text-sm font-medium mb-1">
                    Upload Images
                </label>

                <UploadImages
                    images={images}
                    onChange={(imgs) =>
                        setValue(
                            "images",
                            imgs,
                            {
                                shouldValidate: true,
                            }
                        )
                    }
                />
            </div>

            <InputField
                label="Product Name"
                name="name"
                register={register}
                error={errors.name}
            />

            <div className="grid grid-cols-2 gap-4">
                <InputField
                    label="Price"
                    name="price"
                    type="number"
                    register={register}
                    error={errors.price}
                />

                <SelectField
                    label="Category"
                    name="categoryId"
                    register={register}
                    error={errors.categoryId}
                    options={[
                        {
                            label: "Select category",
                            value: "",
                        },
                        ...categories.map((item: any) => ({
                            label: item.name,
                            value: item.id,
                        })),
                    ]}
                />
            </div>

            <TextareaField
                label="Description"
                name="description"
                register={register}
                error={errors.description}
                rows={5}
                placeholder="Product description..."
            />

            <CustomButton
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-black text-white rounded-lg disabled:opacity-50"
            >
                {loading
                    ? "Saving..."
                    : isEdit
                        ? "Update Product"
                        : "Create Product"}
            </CustomButton>
        </form>
    );
}