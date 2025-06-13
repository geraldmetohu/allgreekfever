const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const event = await prisma.event.create({
    data: {
      name: "Greek Night",
      description: "A night of music and dancing",
      date: new Date("2025-08-01"),
      time: "21:00",
      singer: "Nikos Vertis",
      location: "London",
      price: 50.0,
      isFeatured: true,
      image: ["https://example.com/image.jpg"] // ✅ Set directly in the array
    }
  });

  const plan = await prisma.plan.create({
    data: {
      name: "Main Layout",
      width: 24,
      height: 36,
      eventId: event.id
    }
  });

  const table = await prisma.table.create({
    data: {
      name: "VIP 1",
      shape: "CIRCLE",
      position: "HORIZONTAL",
      rounded: true,
      color: "BLACK",
      width: 12,
      height: 12,
      startX: 2,
      startY: 4,
      planId: plan.id,
      seats: 10,
      price: 100,
      type: "VIP" // ✅ Required field
    }
  });

  await prisma.booking.create({
    data: {
      paid: true,
      date: new Date("2025-08-01"),
      time: "21:00",
      customer: "Maria Papadopoulos",
      email: "maria@example.com",
      tickets: 2,
      total: 200,
      tableId: table.id,
      eventId: event.id
    }
  });

  await prisma.user.create({
    data: {
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      profileImage: "https://example.com/profile.jpg"
    }
  });

  await prisma.banner.create({
    data: {
      title: "Summer Promo",
      imageString: "https://example.com/banner.jpg"
    }
  });
}

main()
  .then(() => {
    console.log("✅ Seed complete");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error("❌ Seed failed", e);
    return prisma.$disconnect();
  });
