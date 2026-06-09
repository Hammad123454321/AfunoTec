/* eslint-disable no-console */
import { PrismaClient, UserRole, CategoryType } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const CATEGORIES: Array<{
  slug: string;
  name: string;
  type: CategoryType;
  icon: string;
  sortOrder: number;
}> = [
  { slug: 'stays', name: 'Hotels, Apartments & Lodges', type: 'STAY', icon: 'Hotel', sortOrder: 1 },
  { slug: 'things-to-do', name: 'Things To Do', type: 'THING_TO_DO', icon: 'Compass', sortOrder: 2 },
  { slug: 'tours', name: 'Tours', type: 'TOUR', icon: 'Map', sortOrder: 3 },
  { slug: 'travels', name: 'Travels', type: 'TRAVEL', icon: 'Plane', sortOrder: 4 },
  { slug: 'transportation', name: 'Transportation', type: 'TRANSPORTATION', icon: 'Car', sortOrder: 5 },
  { slug: 'nosy-be', name: 'Nosy Be', type: 'NOSY_BE', icon: 'Palmtree', sortOrder: 6 },
  { slug: 'corporate', name: 'Corporate', type: 'CORPORATE', icon: 'Briefcase', sortOrder: 7 },
  { slug: 'culture', name: 'Culture', type: 'CULTURE', icon: 'Landmark', sortOrder: 8 },
  { slug: 'events', name: 'Events', type: 'EVENT', icon: 'CalendarDays', sortOrder: 9 },
  { slug: 'work-places', name: 'Work Places', type: 'WORKPLACE', icon: 'Building2', sortOrder: 10 },
  { slug: 'co-working', name: 'Co-Working', type: 'CO_WORKING', icon: 'Users', sortOrder: 11 },
];

const CURRENCIES = [
  { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar', rateToMga: 1 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToMga: 4500 },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToMga: 4900 },
];

async function main(): Promise<void> {
  console.log('Seeding database...');

  // Currencies
  for (const c of CURRENCIES) {
    await prisma.currency.upsert({
      where: { code: c.code },
      update: { name: c.name, symbol: c.symbol, rateToMga: c.rateToMga, isActive: true },
      create: { code: c.code, name: c.name, symbol: c.symbol, rateToMga: c.rateToMga },
    });
  }
  console.log(`  ✓ Currencies (${CURRENCIES.length})`);

  // Categories
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, type: cat.type, iconName: cat.icon, sortOrder: cat.sortOrder },
      create: {
        slug: cat.slug,
        name: cat.name,
        type: cat.type,
        iconName: cat.icon,
        sortOrder: cat.sortOrder,
      },
    });
  }
  console.log(`  ✓ Categories (${CATEGORIES.length})`);

  // Default admin
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@ameer-nasr.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe!Admin#2026';
  const adminName = process.env.SEED_ADMIN_NAME ?? 'System Admin';
  const adminHash = await argon2.hash(adminPassword);

  await prisma.user.upsert({
    where: { email: adminEmail },
    // Re-assert the admin password/role on every seed so a drifted or locked
    // admin is always recoverable with the configured credentials.
    update: {
      name: adminName,
      passwordHash: adminHash,
      role: UserRole.ADMIN,
      isActive: true,
      failedLoginCount: 0,
      lockedUntil: null,
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash: adminHash,
      role: UserRole.ADMIN,
      emailVerifiedAt: new Date(),
      preferredLocale: 'en',
      preferredCurrency: 'MGA',
    },
  });
  console.log(`  ✓ Admin user (${adminEmail})`);

  // Newsletter sample (so admin sees a row)
  await prisma.newsletterSubscriber.upsert({
    where: { email: 'demo-subscriber@example.com' },
    update: {},
    create: { email: 'demo-subscriber@example.com', locale: 'en' },
  });
  console.log(`  ✓ Newsletter sample`);

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
