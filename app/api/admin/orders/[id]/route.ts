import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderStatus } = await req.json();

  const order = await prisma.order.findUnique({
    where: { id: params.id },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const validTransitions: Record<string, string[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["SHIPPING", "CANCELLED"],
    SHIPPING: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: [],
  };

  if (!validTransitions[order.orderStatus].includes(orderStatus)) {
    return NextResponse.json(
      { error: "Invalid status transition" },
      { status: 400 },
    );
  }

  try {
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updateData: any = {
        orderStatus,
      };

      if (orderStatus === "CANCELLED") {
        updateData.paymentStatus = "FAILED";
      }

      if (orderStatus === "COMPLETED") {
        updateData.deliveredAt = new Date();

        if (order.paymentMethod === "COD") {
          updateData.paymentStatus = "PAID";
          updateData.paidAt = new Date();
        }
      }

      return await tx.order.update({
        where: { id: params.id },
        data: updateData,
      });
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("UPDATE ORDER ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
