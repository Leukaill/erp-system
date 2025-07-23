import { seedDatabase } from "./seedData";

async function runSeed() {
  try {
    await seedDatabase();
    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

runSeed();