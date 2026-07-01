import { prisma } from "./src/lib/prisma";
import bcrypt from "bcryptjs";

async function test() {
  try {
    const email = "test2@example.com";
    console.log("Checking user...");
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    console.log("Existing user:", existingUser);

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    console.log("Password hashed.");

    console.log("Creating user...");
    const user = await prisma.user.create({
      data: {
        name: "Test",
        email,
        password: hashedPassword,
      },
    });
    console.log("User created:", user);
  } catch (err) {
    console.error("Caught error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
