import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q")?.trim() || "";
  const keywords = q.split(" ").filter(Boolean).slice(0, 3);

  if (!q) return NextResponse.json([]);

  const products = await prisma.product.findMany({
    where: {
      AND: keywords.map((k) => ({
        name: {
          contains: k,
          mode: "insensitive",
        },
      })),
    },
    select: {
      id: true,
      name: true,
      price: true,
      slug: true,
      images: {
        select: {
          url: true,
          isPrimary: true,
        },
      },
    },
    take: 20,
  });

  const sorted = products.sort((a, b) => {
    const qLower = q.toLowerCase();
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    if (aName === qLower) return -1;
    if (bName === qLower) return 1;

    if (aName.startsWith(qLower)) return -1;
    if (bName.startsWith(qLower)) return 1;

    if (aName.includes(keywords[0])) return -1;
    if (bName.includes(keywords[0])) return 1;

    return aName.length - bName.length;
  });

  const result = sorted.slice(0, 5).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    slug: p.slug,
    image:
      p.images.find((img) => img.isPrimary)?.url || p.images[0]?.url || null,
  }));

  return NextResponse.json(result);
}
