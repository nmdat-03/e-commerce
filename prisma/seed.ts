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

  // ===== BRAND =====
  const brands = await Promise.all(
    ["brand-1", "brand-2", "brand-3"].map((slug, i) =>
      prisma.brand.upsert({
        where: { slug },
        update: {},
        create: {
          name: `Brand ${i + 1}`,
          slug,
        },
      }),
    ),
  );

  // ===== PRODUCT =====
  for (let i = 1; i <= 30; i++) {
    const category = categories[i % categories.length];
    const brand = brands[i % brands.length];

    await prisma.product.upsert({
      where: { slug: `product-${i}` },
      update: {},
      create: {
        name: `Product ${i}`,
        slug: `product-${i}`,
        description: `This is description of Product ${i}`,
        price: (Math.floor(Math.random() * 20) + 1) * 5,
        stock: 100,
        categoryId: category.id,
        brandId: brand.id,
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
