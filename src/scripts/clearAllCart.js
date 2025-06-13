const { redis } = require('../../lib/redis'); // ✅ Correct relative path

// ⚠️ Update this to match your `lib/redis.ts`
const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redis.connect().then(async () => {
  const keys = await redis.keys("cart-*");

  if (keys.length === 0) {
    console.log("✅ No cart keys found.");
    process.exit();
  }

  const deleted = await redis.del(...keys);
  console.log(`🗑️ Deleted ${deleted} cart keys:`);
  console.log(keys);

  process.exit();
});
