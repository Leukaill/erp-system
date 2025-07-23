import { db } from "./db";
import { users } from "@shared/schema";
import { hashPassword } from "./localAuth";
import { eq } from "drizzle-orm";

async function createTestUser() {
  try {
    // First, let's see what users exist
    const existingUsers = await db.select().from(users);
    console.log("Existing users:", existingUsers.map(u => ({ 
      email: u.email, 
      hasPassword: !!u.password,
      passwordLength: u.password?.length || 0 
    })));

    // Create a test user with known credentials
    const testPassword = await hashPassword("password123");
    console.log("Hashed password:", testPassword);

    // Delete existing test user if it exists
    await db.delete(users).where(eq(users.email, "test@agriflow.rw"));

    // Create new test user
    const testUser = await db.insert(users).values({
      id: "test-user-001",
      email: "test@agriflow.rw",
      password: testPassword,
      firstName: "Test",
      lastName: "User",
      profileImageUrl: "",
      role: "farm_manager"
    }).returning();

    console.log("Created test user:", testUser[0]);
    console.log("\nTest credentials:");
    console.log("Email: test@agriflow.rw");
    console.log("Password: password123");

  } catch (error) {
    console.error("Error creating test user:", error);
  }
}

createTestUser();