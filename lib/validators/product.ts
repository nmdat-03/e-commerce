import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),

  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number({
        error: "Please enter price",
      })
      .min(0, "Price cannot be negative"),
  ),

  description: z.string().optional(),

  categoryId: z.string().min(1, "Please select category"),

  images: z.array(
    z.object({
      url: z.string(),
      publicId: z.string().optional(),
    }),
  ),
});

export type ProductFormValues = z.input<typeof productSchema>;
export type ProductSubmitValues = z.output<typeof productSchema>;
