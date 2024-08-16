import { PrismaClient } from "@prisma/client";
import process from "process";

const prisma = new PrismaClient();
async function main() {
  const estate = await prisma.estates.create({
    data: {
      name: "Jakande",
      address: "Jakande road",
      description: "An estate for all",
      status: "ACTIVE",
    },
  });
  console.log("estate:", estate);
  const roles = await prisma.roles.createMany({
    data: [{ name: "admin" }, { name: "resident" }, { name: "superadmin" }],
  });
  console.log("roles", roles);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
