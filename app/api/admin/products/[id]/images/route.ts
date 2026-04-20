import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const imageSchema = z.object({
  url: z.string().min(1, "Image url is required"),
  publicId: z.string().optional().nullable(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const parsed = imageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid data",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    const count = await prisma.productImage.count({
      where: {
        productId: params.id,
      },
    });

    const image = await prisma.productImage.create({
      data: {
        url: data.url,
        publicId: data.publicId || null,
        productId: params.id,
        position: count,
        isPrimary: count === 0,
      },
    });

    return NextResponse.json(image);
  } catch {
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
