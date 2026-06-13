/* eslint-disable no-console */
import 'reflect-metadata';
import 'dotenv/config';
import * as argon2 from 'argon2';
import mongoose, { model } from 'mongoose';
import { Types } from 'mongoose';
import { CategoryType, UserRole } from '../common/enums';
import { Category, CategorySchema } from './schemas/category.schema';
import { Currency, CurrencySchema } from './schemas/currency.schema';
import {
  NewsletterSubscriber,
  NewsletterSubscriberSchema,
} from './schemas/newsletter-subscriber.schema';
import { User, UserSchema } from './schemas/user.schema';

const CATEGORIES: Array<{
  slug: string;
  name: string;
  type: CategoryType;
  icon: string;
  sortOrder: number;
}> = [
  { slug: 'stays', name: 'Hotels, Apartments & Lodges', type: CategoryType.STAY, icon: 'Hotel', sortOrder: 1 },
  { slug: 'things-to-do', name: 'Things To Do', type: CategoryType.THING_TO_DO, icon: 'Compass', sortOrder: 2 },
  { slug: 'tours', name: 'Tours', type: CategoryType.TOUR, icon: 'Map', sortOrder: 3 },
  { slug: 'travels', name: 'Travels', type: CategoryType.TRAVEL, icon: 'Plane', sortOrder: 4 },
  { slug: 'transportation', name: 'Transportation', type: CategoryType.TRANSPORTATION, icon: 'Car', sortOrder: 5 },
  { slug: 'nosy-be', name: 'Nosy Be', type: CategoryType.NOSY_BE, icon: 'Palmtree', sortOrder: 6 },
  { slug: 'corporate', name: 'Corporate', type: CategoryType.CORPORATE, icon: 'Briefcase', sortOrder: 7 },
  { slug: 'culture', name: 'Culture', type: CategoryType.CULTURE, icon: 'Landmark', sortOrder: 8 },
  { slug: 'events', name: 'Events', type: CategoryType.EVENT, icon: 'CalendarDays', sortOrder: 9 },
  { slug: 'work-places', name: 'Work Places', type: CategoryType.WORKPLACE, icon: 'Building2', sortOrder: 10 },
  { slug: 'co-working', name: 'Co-Working', type: CategoryType.CO_WORKING, icon: 'Users', sortOrder: 11 },
];

const CURRENCIES = [
  { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar', rateToMga: '1' },
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToMga: '4500' },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToMga: '4900' },
];

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME ?? 'ameer_nasr';
  if (!uri) throw new Error('MONGODB_URI is not set');

  await mongoose.connect(uri, { dbName });
  console.log(`Seeding database (db: ${dbName})...`);

  const CurrencyModel = model(Currency.name, CurrencySchema);
  const CategoryModel = model(Category.name, CategorySchema);
  const UserModel = model(User.name, UserSchema);
  const NewsletterModel = model(NewsletterSubscriber.name, NewsletterSubscriberSchema);

  // Currencies (natural _id = ISO code)
  for (const c of CURRENCIES) {
    await CurrencyModel.updateOne(
      { _id: c.code },
      {
        $set: {
          name: c.name,
          symbol: c.symbol,
          rateToMga: Types.Decimal128.fromString(c.rateToMga),
          isActive: true,
        },
      },
      { upsert: true },
    );
  }
  console.log(`  ✓ Currencies (${CURRENCIES.length})`);

  // Categories
  for (const cat of CATEGORIES) {
    await CategoryModel.updateOne(
      { slug: cat.slug },
      { $set: { name: cat.name, type: cat.type, iconName: cat.icon, sortOrder: cat.sortOrder } },
      { upsert: true },
    );
  }
  console.log(`  ✓ Categories (${CATEGORIES.length})`);

  // Default admin — re-assert credentials/role on every seed so a drifted or
  // locked admin is always recoverable with the configured credentials.
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@ameer-nasr.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe!Admin#2026';
  const adminName = process.env.SEED_ADMIN_NAME ?? 'System Admin';
  const adminHash = await argon2.hash(adminPassword);

  await UserModel.updateOne(
    { email: adminEmail },
    {
      $set: {
        name: adminName,
        passwordHash: adminHash,
        role: UserRole.ADMIN,
        isActive: true,
        failedLoginCount: 0,
        lockedUntil: null,
      },
      $setOnInsert: {
        email: adminEmail,
        emailVerifiedAt: new Date(),
        preferredLocale: 'en',
        preferredCurrency: 'MGA',
      },
    },
    { upsert: true },
  );
  console.log(`  ✓ Admin user (${adminEmail})`);

  // Newsletter sample (so admin sees a row)
  await NewsletterModel.updateOne(
    { email: 'demo-subscriber@example.com' },
    { $setOnInsert: { email: 'demo-subscriber@example.com', locale: 'en', isActive: true } },
    { upsert: true },
  );
  console.log('  ✓ Newsletter sample');

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => {
    void mongoose.disconnect();
  });
