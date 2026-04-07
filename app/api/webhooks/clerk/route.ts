import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const payload = await req.text();
  const headerList = await headers();

  const svix_id = headerList.get("svix-id");
  const svix_timestamp = headerList.get("svix-timestamp");
  const svix_signature = headerList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Missing svix headers", { status: 400 });
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return new NextResponse("Server misconfigured", { status: 500 });
  }

  const wh = new Webhook(webhookSecret);

  let evt: any;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verify failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;
  const data = evt.data;

  try {
    // =========================
    // USER CREATED / UPDATED
    // =========================
    if (eventType === "user.created" || eventType === "user.updated") {
      const {
        id,
        email_addresses,
        primary_email_address_id,
        first_name,
        last_name,
        image_url,
        username,
      } = data;

      const primaryEmail =
        email_addresses?.find((e: any) => e.id === primary_email_address_id)
          ?.email_address || null;

      const name = `${first_name || ""} ${last_name || ""}`.trim() || null;

      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email: primaryEmail,
          name,
          image: image_url,
          username: username || null,
        },
        create: {
          clerkId: id,
          email: primaryEmail,
          name,
          image: image_url,
          username: username || null,
          cart: {
            create: {},
          },
        },
      });

      console.log("User synced:", id);
    }

    // =========================
    // USER DELETED
    // =========================
    if (eventType === "user.deleted") {
      const { id } = data;

      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email: null,
          name: "Deleted User",
          image: null,
        },
      });

      console.log("User deleted:", id);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DB error:", err);
    return new NextResponse("Database error", { status: 500 });
  }
}
