"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type CreateOrderInput = {
  fullName: string;
  phone: string;
  address: string;
  paymentMethod: "COD" | "VNPAY";
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
};

/*----------------------------------------*/
/*              CREATE ORDER              */
/*----------------------------------------*/
export async function createOrder(data: CreateOrderInput) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!user.cart) {
    throw new Error("Cart not found");
  }

  const lastOrder = await prisma.order.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (
    lastOrder &&
    Date.now() - new Date(lastOrder.createdAt).getTime() < 10000
  ) {
    throw new Error("Please try again later!!!");
  }

  const order = await prisma.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        cartId: user.cart!.id,
        productId: {
          in: data.items.map((i) => i.productId),
        },
      },
    });

    if (!cartItems.length) {
      throw new Error("Cart is empty");
    }

    if (cartItems.length !== data.items.length) {
      throw new Error("Invalid cart items");
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await tx.order.create({
      data: {
        userId: user.id,
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        paymentMethod: data.paymentMethod,
        orderStatus: "PENDING",
        paymentStatus: "PENDING",
        total,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    if (data.paymentMethod === "COD") {
      await tx.cartItem.deleteMany({
        where: {
          cartId: user.cart!.id,
          productId: {
            in: cartItems.map((item) => item.productId),
          },
        },
      });
    }

    return order;
  });

  return order;
}
