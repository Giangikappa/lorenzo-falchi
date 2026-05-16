import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const anelli = await prisma.category.upsert({
    where: { slug: "anelli" },
    update: {},
    create: { name: "Anelli", slug: "anelli" },
  });

  const collane = await prisma.category.upsert({
    where: { slug: "collane" },
    update: {},
    create: { name: "Collane", slug: "collane" },
  });

  await prisma.category.upsert({
    where: { slug: "bracciali" },
    update: {},
    create: { name: "Bracciali", slug: "bracciali" },
  });

  await prisma.category.upsert({
    where: { slug: "orecchini" },
    update: {},
    create: { name: "Orecchini", slug: "orecchini" },
  });

  console.log("Categorie create:", { anelli, collane });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
