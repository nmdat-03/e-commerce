import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { addressSchema } from "@/lib/validators/address";

/*----------------------------------------*/
/*              EDIT ADDRESS              */
/*----------------------------------------*/
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    /*----------------------------------------*/
    /*            SET DEFAULT CASE            */
    /*----------------------------------------*/
    if (body.setDefault) {
      // reset tất cả address về false
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });

      const updated = await prisma.address.update({
        where: {
          id: params.id,
        },
        data: {
          isDefault: true,
        },
      });

      return NextResponse.json(updated);
    }

    /*----------------------------------------*/
    /*            NORMAL UPDATE               */
    /*----------------------------------------*/
    const result = addressSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.flatten() },
        { status: 400 },
      );
    }

    const updated = await prisma.address.update({
      where: {
        id: params.id,
      },
      data: result.data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/*----------------------------------------*/
/*            DELETE ADDRESS              */
/*----------------------------------------*/
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const address = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await prisma.address.delete({
      where: {
        id: params.id,
      },
    });

    /*----------------------------------------*/
    /*     AUTO SET DEFAULT IF NEEDED         */
    /*----------------------------------------*/
    if (address.isDefault) {
      const another = await prisma.address.findFirst({
        where: { userId: user.id },
      });

      if (another) {
        await prisma.address.update({
          where: { id: another.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
