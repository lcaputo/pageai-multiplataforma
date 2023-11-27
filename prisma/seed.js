const { PrismaClient } = require("@prisma/client");

const roles = [
  { id: 1, name: "Admin" },
  { id: 2, name: "User" }
];


const prisma = new PrismaClient();

async function seed() {
  try {
    roles.forEach(async (role) => {
      await prisma.Roles.create({
        data: role,
      });
    });

    console.log("Seed data inserted successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
