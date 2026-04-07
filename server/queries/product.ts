import prisma from "@/lib/prisma";
/*----------------------------------------*/
/*             GET ALL PRODUCTS           */
/*----------------------------------------*/
type GetProductsParams = {
  searchQuery?: string;
  sort?: string;
  categoryId?: string;
};

export async function getProducts({
  searchQuery,
  sort,
  categoryId,
}: GetProductsParams) {
  const where = {
    ...(searchQuery && {
      name: {
        contains: searchQuery,
        mode: "insensitive" as const,
      },
    }),
    ...(categoryId && { categoryId }),
  };

  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: true,
      },
      orderBy,
    }),
    prisma.product.count({
      where,
    }),
  ]);

  return { products, total };
}

/*----------------------------------------*/
/*           GET PRODUCT BY ID            */
/*----------------------------------------*/
export async function getProductById(id: string) {
  try {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
      },
    });
  } catch (error) {
    console.error("[GET_PRODUCT_ERROR]", error);
    throw new Error("Cannot fetch product");
  }
}

/*----------------------------------------*/
/*           GET PRODUCT BY SLUG          */
/*----------------------------------------*/
export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
      },
    });
  } catch (error) {
    console.error("[GET_PRODUCT_BY_SLUG_ERROR]", error);
    throw new Error("Cannot fetch product");
  }
}
