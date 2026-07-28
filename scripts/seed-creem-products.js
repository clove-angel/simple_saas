/**
 * 种子脚本：在 Creem 测试环境中创建所有产品，并输出产品 ID。
 *
 * 用法: node --env-file=.env.local scripts/seed-creem-products.js
 * 运行后会输出每个产品的 ID，用于更新 config/subscriptions.ts。
 */
const { createCreem } = require('creem_io');

const creem = createCreem({
  apiKey: process.env.CREEM_API_KEY,
  testMode: process.env.CREEM_TEST_MODE === 'true',
});

const products = [
  // 订阅产品
  {
    name: 'Starter',
    description: 'Perfect for individual developers and small projects.',
    price: 1100, // $11.00
    currency: 'USD',
    billingType: 'recurring',
    billingPeriod: 'every-month',
    taxMode: 'exclusive',
    taxCategory: 'saas',
  },
  {
    name: 'Business',
    description: 'Ideal for growing businesses and development teams.',
    price: 2900, // $29.00
    currency: 'USD',
    billingType: 'recurring',
    billingPeriod: 'every-month',
    taxMode: 'exclusive',
    taxCategory: 'saas',
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with advanced requirements.',
    price: 9900, // $99.00
    currency: 'USD',
    billingType: 'recurring',
    billingPeriod: 'every-month',
    taxMode: 'exclusive',
    taxCategory: 'saas',
  },
  // 积分包产品（一次性购买，不需要 billingPeriod）
  {
    name: 'Basic Credits Package',
    description: '3 credits for testing and small-scale projects.',
    price: 900, // $9.00
    currency: 'USD',
    billingType: 'onetime',
    taxMode: 'exclusive',
    taxCategory: 'saas',
  },
  {
    name: 'Standard Credits Package',
    description: '6 credits for medium-sized applications.',
    price: 1300, // $13.00
    currency: 'USD',
    billingType: 'onetime',
    taxMode: 'exclusive',
    taxCategory: 'saas',
  },
  {
    name: 'Premium Credits Package',
    description: '9 credits for larger applications and production use.',
    price: 2900, // $29.00
    currency: 'USD',
    billingType: 'onetime',
    taxMode: 'exclusive',
    taxCategory: 'saas',
  },
];

async function seed() {
  console.log('Creating products in Creem test environment...\n');

  const results = [];

  for (const product of products) {
    try {
      const created = await creem.products.create(product);
      console.log(`✓ ${product.name} — ID: ${created.id}`);
      results.push({ name: product.name, id: created.id, type: product.billingType });
    } catch (err) {
      console.error(`✗ ${product.name} — ${err.message}`);
    }
  }

  console.log('\n--- 复制以下内容更新 config/subscriptions.ts ---\n');
  for (const r of results) {
    console.log(`${r.name}: ${r.id} (${r.type})`);
  }
}

seed();
