import { hashPassword } from "./localAuth";
import { scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  try {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
}

async function testPasswordAuth() {
  console.log("Testing password authentication...");
  
  // Test with the stored password from database
  const storedPassword = "ab2afae15a8a32c9562544a4ffa14c282dbecd3cfc196f64f6c8faff8cbc9a7f921df663f51c7f31a62f08a806e049f2fed8e519c4a8f63c187079cc7e37180f.64b9b1f5505a2f6ab6539a03702798cd";
  const testPassword = "password123";
  
  console.log("Stored password format:", storedPassword.split(".").map(part => `${part.substring(0, 10)}... (length: ${part.length})`));
  
  const isValid = await comparePasswords(testPassword, storedPassword);
  console.log("Password comparison result:", isValid);
  
  // Create a new hash and test
  console.log("\nCreating new hash...");
  const newHash = await hashPassword(testPassword);
  console.log("New hash:", newHash);
  
  const isNewValid = await comparePasswords(testPassword, newHash);
  console.log("New hash comparison result:", isNewValid);
}

testPasswordAuth();