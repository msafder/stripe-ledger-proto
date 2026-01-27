import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const accounts = [
    { code: 'STRIPE_CLEARING', name: 'Stripe clearing (captured funds not yet paid out)' },
    { code: 'REVENUE', name: 'Revenue' }
  ];

  for (const a of accounts) {
    await prisma.account.upsert({
      where: { code: a.code },
      update: { name: a.name },
      create: a
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });