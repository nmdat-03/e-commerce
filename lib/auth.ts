import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) return null;

  const clerkUser = await currentUser();

  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null;

  const phone = clerkUser?.phoneNumbers?.[0]?.phoneNumber ?? null;

  const username = clerkUser?.username ?? null;

  const name =
    `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim() || null;

  const image = clerkUser?.imageUrl ?? null;

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      email,
      phone,
      username,
      name,
      image,
    },
    create: {
      clerkId: userId,
      email,
      phone,
      username,
      name,
      image,
      cart: {
        create: {},
      },
    },
    include: {
      cart: true,
    },
  });

  return user;
}
