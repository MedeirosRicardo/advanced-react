import { products } from './data';
import config from '../keystone';
import { getContext } from '@keystone-6/core/context'
import * as PrismaModule from '@prisma/client';

export async function insertSeedData(ks: any) {
  const context = getContext(config, PrismaModule);

  console.log(`🌱 Inserting Seed Data: ${products.length} Products`);
  for (const product of products) {
    console.log(`  🛍️ Adding Product: ${product.name}`);
    await context.db.Product.createOne({
      data: {
        name: product.name,
        description: product.description,
        statusbar: product.status,
        price: product.price,
      },
    });
  }
  console.log(`✅ Seed Data Inserted: ${products.length} Products`);
  console.log(`👋 Please start the process with \`yarn dev\` or \`npm run dev\``);
}
