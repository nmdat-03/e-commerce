import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { productSchema } from "@/lib/validators/product";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const parsed = productSchema.safeParse(body);

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

    const product = await prisma.product.update({
      where: {
        id: params.id,
      },
      data: {
        name: data.name,
        slug: body.slug,
        price: data.price,
        description: data.description || null,
        categoryId: data.categoryId,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 400 },
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
