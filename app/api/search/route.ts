import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q) return NextResponse.json([]);

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: q,
        mode: "insensitive",
      },
    },
    include: {
      images: true,
    },
    take: 5,
  });

  // format lại data
  const result = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    slug: p.slug,
    image:
      p.images.find((img) => img.isPrimary)?.url || p.images[0]?.url || null,
  }));

  return NextResponse.json(result);
}
