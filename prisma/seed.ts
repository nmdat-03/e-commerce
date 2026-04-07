import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // ===== CATEGORY =====
  const categories = await Promise.all(
    ["category-1", "category-2", "category-3"].map((slug, i) =>
      prisma.category.upsert({
        where: { slug },
        update: {},
        create: {
          name: `Category ${i + 1}`,
          slug,
        },
      }),
    ),
  );

  // ===== PRODUCT =====
  for (let i = 1; i <= 10; i++) {
    const category = categories[i % categories.length];

    await prisma.product.upsert({
      where: { slug: `product-${i}` },
      update: {},
      create: {
        name: `Product ${i}`,
        slug: `product-${i}`,
        description: `This is description for Product ${i}`,
        price: 10 * i,
        stock: 100,
        categoryId: category.id,
        images: {
          create: [
            {
              url: `/images/camera.jpg`,
              isPrimary: true,
            },
          ],
        },
      },
    });
  }

  // ===== USER =====
  for (let i = 1; i <= 5; i++) {
    await prisma.user.upsert({
      where: { clerkId: `seed_user_${i}` },
      update: {},
      create: {
        clerkId: `seed_user_${i}`,
        username: `user${i}`,
        name: `User ${i}`,
        phone: `012345678${i}`,
        email: `user${i}@example.com`,
      },
    });
  }

  console.log("Seeding done");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
