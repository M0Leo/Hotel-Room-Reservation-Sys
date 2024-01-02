import { PrismaClient } from "@prisma/client";
import { config } from "../config";
import bcrypt from "bcryptjs";

export default function initAdmin() {
  const prisma = new PrismaClient();
  prisma.user.findFirst({
    where: {
      username: config.admin,
    },
  }).then((user) => {
    if (!user) {
      prisma.user.create({
        data: {
          username: config.admin,
          password: bcrypt.hashSync(config.adminPassword, 12),
          role: 'ADMIN',
        },
      });
    }
  }).catch((error) => {
    throw new Error(error);
  });
}