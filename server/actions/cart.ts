"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/*------------------------------*/
/*      ADD TO CART ACTION      */
/*------------------------------*/
export async function addToCart(productId: string) {
  const user = await getCurrentUser();

  if (!user || !user.cart) {
    return { error: "UNAUTHORIZED" };
  }

  const existing = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: user.cart.id,
        productId,
      },
    },
  });

  let item;

  if (existing) {
    item = await prisma.cartItem.update({
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
  } else {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) return { error: "PRODUCT_NOT_FOUND" };

    item = await prisma.cartItem.create({
      data: {
        cartId: user.cart.id,
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
  }

  return {
    success: true,
    item: {
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      image: item.product.images[0]?.url,
      selected: true,
    },
  };
}

/*---------------------------------*/
/*      REMOVE PRODUCT IN DB       */
/*---------------------------------*/
export async function removeCartItem(cartItemId: string) {
  const user = await getCurrentUser();

  if (!user || !user.cart) {
    return { error: "UNAUTHORIZED" };
  }

  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!item || item.cartId !== user.cart.id) {
    return { error: "UNAUTHORIZED" };
  }

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  return { success: true };
}

/*-----------------------------------*/
/*      INCREASE QUANTITY IN DB      */
/*-----------------------------------*/
export async function increaseCartItem(cartItemId: string) {
  const user = await getCurrentUser();

  if (!user || !user.cart) {
    return { error: "UNAUTHORIZED" };
  }

  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!item || item.cartId !== user.cart.id) {
    return { error: "UNAUTHORIZED" };
  }

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: {
      quantity: { increment: 1 },
    },
  });

  return { success: true };
}

/*-----------------------------------*/
/*      DECREASE QUANTITY IN DB      */
/*-----------------------------------*/
export async function decreaseCartItem(cartItemId: string) {
  const user = await getCurrentUser();

  if (!user || !user.cart) {
    return { error: "UNAUTHORIZED" };
  }

  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!item || item.cartId !== user.cart.id) {
    return { error: "UNAUTHORIZED" };
  }

  if (item.quantity <= 1) {
    return { error: "MIN_QUANTITY" };
  }

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: {
      quantity: { decrement: 1 },
    },
  });

  return { success: true };
}

/*------------------------------*/
/*        GET CART ACTION       */
/*------------------------------*/
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

  return items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    price: item.price,
    quantity: item.quantity,
    image: item.product.images[0]?.url,
    selected: true,
  }));
}

/*------------------------------*/
/*      MERGE CART ACTION       */
/*------------------------------*/
export async function mergeCart(items: any[]) {
  const user = await getCurrentUser();

  if (!user || !user.cart) return;

  const cart = user.cart;

  await Promise.all(
    items.map(async (item) => {
      const existing = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: item.productId,
          },
        },
      });

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: {
            quantity: item.quantity,
          },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          },
        });
      }
    }),
  );

  return { success: true };
}
