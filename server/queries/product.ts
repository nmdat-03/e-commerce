import prisma from "@/lib/prisma";

export const PAGE_SIZE = 20;

/*----------------------------------------*/
/*             TYPES                      */
/*----------------------------------------*/
type GetProductsParams = {
  searchQuery?: string;
  sort?: "price_asc" | "price_desc" | "newest";
  categorySlug?: string;
  page?: number;
  limit?: number;
};

/*----------------------------------------*/
/*        BUILD WHERE CONDITION           */
/*----------------------------------------*/
function buildWhere({
  searchQuery,
  categorySlug,
}: GetProductsParams) {
  const categorySlugs = categorySlug?.split(",").filter(Boolean);

  return {
    isActive: true,

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
export async function getProducts({
  page = 1,
  limit = PAGE_SIZE,
  ...params
}: GetProductsParams) {
  const where = buildWhere(params);
  const orderBy = buildOrderBy(params.sort);

  const take = limit;
  const skip = (page - 1) * limit;

  return prisma.product.findMany({
    where,
    include: {
      images: true,
    },
    orderBy,
    take,
    skip,
  });
}

/*----------------------------------------*/
/*             GET PRODUCTS COUNT         */
/*----------------------------------------*/
export async function getProductsCount(params: GetProductsParams) {
  const where = buildWhere(params);

  return prisma.product.count({
    where,
  });
}

/*----------------------------------------*/
/*        HOMEPAGE: NEWEST PRODUCTS       */
/*----------------------------------------*/
export async function getNewestProducts(limit = 10) {
  return prisma.product.findMany({
    where: {
      isActive: true,
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
    },
  });
}

/*----------------------------------------*/
/*           GET PRODUCT BY ID            */
/*----------------------------------------*/
export async function getProductById(id: string) {
  return prisma.product.findFirst({
    where: {
      id,
      isActive: true,
    },
    include: {
      category: true,
      images: true,
    },
  });
}

/*----------------------------------------*/
/*         GET PRODUCT BY SLUG            */
/*----------------------------------------*/
export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
      isActive: true,
    },
    include: {
      category: true,
      images: true,
    },
  });
}
