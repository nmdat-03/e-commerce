import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is too short"),
  phone: z
    .string()
    .regex(/^0\d{9}$/, "Phone must be a valid Vietnamese number"),
  address: z.string().min(5, "Address is too short"),
});

export type AddressInput = z.infer<typeof addressSchema>;
