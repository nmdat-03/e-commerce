import prisma from "@/lib/prisma";

/*----------------------------------------*/
/*             TYPES                      */
/*----------------------------------------*/
type GetProductsParams = {
  searchQuery?: string;
  sort?: "price_asc" | "price_desc" | "newest";
  categorySlug?: string;
  brandSlug?: string;
  page?: number;
  limit?: number;
};

/*----------------------------------------*/
/*        BUILD WHERE CONDITION           */
/*----------------------------------------*/
function buildWhere({
  searchQuery,
  categorySlug,
  brandSlug,
}: GetProductsParams) {
  const categorySlugs = categorySlug?.split(",").filter(Boolean);
  const brandSlugs = brandSlug?.split(",").filter(Boolean);

  return {
    ...(searchQuery && {
      name: {
        contains: searchQuery,
        mode: "insensitive" as const,
      },
    }),
    ...(categorySlugs?.length && {
      category: {
        slug: {
          in: categorySlugs,
        },
      },
    }),
    ...(brandSlugs?.length && {
      brand: {
        slug: {
          in: brandSlugs,
        },
      },
    }),
  };
}

/*----------------------------------------*/
/*        BUILD ORDER BY                  */
/*----------------------------------------*/
function buildOrderBy(sort?: GetProductsParams["sort"]) {
  if (sort === "price_asc") return { price: "asc" as const };
  if (sort === "price_desc") return { price: "desc" as const };
  return { createdAt: "desc" as const };
}

/*----------------------------------------*/
/*             GET ALL PRODUCTS           */
/*----------------------------------------*/
export async function getProducts(params: GetProductsParams) {
  await new Promise((res) => setTimeout(res, 300));

  const { page, limit } = params;

  const where = buildWhere(params);
  const orderBy = buildOrderBy(params.sort);

  const take = limit ?? undefined;
  const skip = page && limit ? (page - 1) * limit : undefined;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: true,
        brand: true,
      },
      orderBy,
      take,
      skip,
    }),
    prisma.product.count({
      where,
    }),
  ]);

  return { products, total };
}

/*----------------------------------------*/
/*        HOMEPAGE: NEWEST PRODUCTS       */
/*----------------------------------------*/
export async function getNewestProducts(limit = 10) {
  return prisma.product.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
      brand: true,
    },
  });
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
/*         GET PRODUCT BY SLUG            */
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
