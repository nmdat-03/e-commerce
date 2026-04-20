"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/*----------------------------------*/
/*        ADD TO CART ACTION        */
/*----------------------------------*/
export async function addToCart(productId: string) {
  const user = await getCurrentUser();

  if (!user || !user.cart) {
    return { error: "UNAUTHORIZED" };
  }

  const cartId = user.cart.id;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) throw new Error("PRODUCT_NOT_FOUND");
      if (!product.isActive) throw new Error("UNAVAILABLE");

      const existing = await tx.cartItem.findUnique({
        where: {
          cartId_productId: { cartId, productId },
        },
      });

      if (existing) {
        return await tx.cartItem.update({
          where: { id: existing.id },
          data: {
            quantity: { increment: 1 },
          },
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        });
      }

      return await tx.cartItem.create({
        data: {
          cartId,
          productId,
          quantity: 1,
          price: product.price,
        },
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
        },
      });
    });

    return {
      success: true,
      item: mapCartItem(result),
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

/*----------------------------------*/
/*        REMOVE ITEM DB            */
/*----------------------------------*/
export async function removeCartItem(cartItemId: string) {
  const user = await getCurrentUser();

  if (!user || !user.cart) {
    return { error: "UNAUTHORIZED" };
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cartId: user.cart.id,
    },
  });

  if (!item) {
    return { error: "UNAUTHORIZED" };
  }

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  return { success: true };
}

/*----------------------------------*/
/*     INCREASE QUANTITY DB         */
/*----------------------------------*/
export async function increaseCartItem(cartItemId: string) {
  const user = await getCurrentUser();

  if (!user || !user.cart) {
    return { error: "UNAUTHORIZED" };
  }

  const cartId = user.cart.id;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const item = await tx.cartItem.findFirst({
        where: {
          id: cartItemId,
          cartId,
        },
        include: {
          product: true,
        },
      });

      if (!item) throw new Error("UNAUTHORIZED");
      if (!item.product.isActive) throw new Error("UNAVAILABLE");

      const updated = await tx.cartItem.update({
        where: { id: cartItemId },
        data: {
          quantity: { increment: 1 },
        },
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
        },
      });

      return updated;
    });

    return {
      success: true,
      item: mapCartItem(result),
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

/*----------------------------------*/
/*     DECREASE QUANTITY DB         */
/*----------------------------------*/
export async function decreaseCartItem(cartItemId: string) {
  const user = await getCurrentUser();

  if (!user || !user.cart) {
    return { error: "UNAUTHORIZED" };
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cartId: user.cart.id,
    },
  });

  if (!item) {
    return { error: "UNAUTHORIZED" };
  }

  if (item.quantity <= 1) {
    return { error: "MIN_QUANTITY" };
  }

  const updated = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: {
      quantity: { decrement: 1 },
    },
    include: {
      product: {
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
    },
  });

  return {
    success: true,
    item: mapCartItem(updated),
  };
}

/*----------------------------------*/
/*           GET CART              */
/*----------------------------------*/
export async function getCart() {
  const user = await getCurrentUser();

  if (!user || !user.cart) return [];

  const items = await prisma.cartItem.findMany({
    where: {
      cartId: user.cart.id,
    },
    include: {
      product: {
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
    },
  });

  return items.map(mapCartItem);
}

/*----------------------------------*/
/*          MERGE CART             */
/*----------------------------------*/
export async function mergeCart(items: any[]) {
  const user = await getCurrentUser();

  if (!user || !user.cart) {
    return { error: "UNAUTHORIZED" };
  }

  const cartId = user.cart.id;

  try {
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.isActive) continue;

        await tx.cartItem.upsert({
          where: {
            cartId_productId: {
              cartId,
              productId: item.productId,
            },
          },
          update: {
            quantity: {
              increment: item.quantity,
            },
          },
          create: {
            cartId,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
          },
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error("[MERGE_CART_ERROR]", error);
    return { error: "MERGE_FAILED" };
  }
}

/*----------------------------------*/
/*            HELPER               */
/*----------------------------------*/
function mapCartItem(item: any) {
  return {
    id: item.id,
    productId: item.productId,
    name: item.product?.name,
    price: item.price,
    quantity: item.quantity,
    image: item.product?.images?.[0]?.url,
    selected: true,
  };
}
