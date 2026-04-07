import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) return null;

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { cart: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        cart: {
          create: {},
        },
      },
      include: { cart: true },
    });
  }

  return user;
}
