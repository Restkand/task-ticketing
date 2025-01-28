import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Lc6263It", 10); // Hash password

  await prisma.user.create({
    data: {
      name: "admin",
      email: "admin@mail.com",
      password: hashedPassword, // Simpan hash ke database
      role: "ADMIN",
    },
  });

  console.log("User created with hashed password");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });