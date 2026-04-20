import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { ids, isActive } = body;

    if (!Array.isArray(ids) || typeof isActive !== "boolean") {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    await prisma.product.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        isActive,
      },
    });

    return NextResponse.json({
      message: "Updated successfully",
    });
  } catch {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
