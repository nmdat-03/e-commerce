import prisma from "@/lib/prisma";

export async function getBrands() {
  return prisma.brand.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: "asc" },
  });
}
