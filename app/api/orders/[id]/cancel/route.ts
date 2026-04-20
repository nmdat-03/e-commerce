import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
  });

  if (!order || order.userId !== user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (!["PENDING", "CONFIRMED"].includes(order.orderStatus)) {
    return NextResponse.json(
      { error: "Cannot cancel this order" },
      { status: 400 },
    );
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        orderStatus: "CANCELLED",
        paymentStatus: order.paymentStatus === "PAID" ? "REFUNDED" : "FAILED",
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("CANCEL ORDER ERROR:", error);

    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 },
    );
  }
}
