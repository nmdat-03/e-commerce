import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // ===== CATEGORY =====
  for (let i = 1; i <= 5; i++) {
    await prisma.category.upsert({
      where: { slug: `category-${i}` },
      update: {},
      create: {
        name: `Category ${i}`,
        slug: `category-${i}`,
      },
    });
  }

  const categories = await prisma.category.findMany();

  // ===== PRODUCT =====
  for (let i = 1; i <= 30; i++) {
    const category = categories[i % categories.length];

    await prisma.product.upsert({
      where: { slug: `product-${i}` },
      update: {},
      create: {
        name: `Product ${i}`,
        slug: `product-${i}`,
        description: `This is description of Product ${i}`,
        price: Math.floor(Math.random() * 90 + 10) * 1000,
        categoryId: category.id,
        images: {
          create: [
            {
              url: "/images/coffee-cup.png",
              isPrimary: true,
            },
          ],
        },
      },
    });
  }

  console.log("Done");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });