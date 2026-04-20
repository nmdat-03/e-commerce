import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { productSchema } from "@/lib/validators/product";

export async function POST(req: NextRequest) {
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

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: body.slug,
        price: data.price,
        description: data.description || null,
        categoryId: data.categoryId,

        images: {
          create: data.images.map((img, index) => ({
            url: img.url,
            publicId: img.publicId || null,
            position: index,
            isPrimary: index === 0,
          })),
        },
      },
      include: {
        images: true,
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

    return NextResponse.json({ message: "Create failed" }, { status: 500 });
  }
}
