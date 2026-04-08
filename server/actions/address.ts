"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/*----------------------------------------*/
/*            GET ALL ADDRESSES           */
/*----------------------------------------*/
export async function getAddresses() {
  const { userId } = await auth();

  if (!userId) return [];

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) return [];

  return prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

/*----------------------------------------*/
/*            CREATE ADDRESS              */
/*----------------------------------------*/
export async function createAddress(data: any) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) throw new Error("User not found");

  return prisma.address.create({
    data: {
      ...data,
      userId: user.id,
    },
  });
}

/*----------------------------------------*/
/*            UPDATE ADDRESS              */
/*----------------------------------------*/
export async function updateAddress(id: string, data: any) {
  if (data.setDefault) {
    const { userId } = await auth();

    const user = await prisma.user.findUnique({
      where: { clerkId: userId! },
    });

    await prisma.address.updateMany({
      where: { userId: user!.id },
      data: { isDefault: false },
    });

    return prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });
  }

  return prisma.address.update({
    where: { id },
    data,
  });
}

/*----------------------------------------*/
/*            DELETE ADDRESS              */
/*----------------------------------------*/
export async function deleteAddress(id: string) {
  const { userId } = await auth();

  const user = await prisma.user.findUnique({
    where: { clerkId: userId! },
  });

  const address = await prisma.address.findFirst({
    where: {
      id,
      userId: user!.id,
    },
  });

  if (!address) throw new Error("Not found");

  await prisma.address.delete({
    where: { id },
  });

  if (address.isDefault) {
    const another = await prisma.address.findFirst({
      where: { userId: user!.id },
    });

    if (another) {
      await prisma.address.update({
        where: { id: another.id },
        data: { isDefault: true },
      });
    }
  }

  return { success: true };
}
