import bcrypt from "bcryptjs";
import { PrismaClient } from '@prisma/client';
import createError from "http-errors";
const prisma = new PrismaClient();

export class AuthService {

    static async register(username: string, password: string) {
        try {
            password = bcrypt.hashSync(password, 12);
            await prisma.user.create({ data: { username, password } });
        } catch (err) {
            throw err;
        }
    }

    static async validate(username: string, password: string) {
        const user = await prisma.user.findUnique({
            where: {
                username,
            }
        })

        if (!user) {
            throw createError.NotFound('User not registered');
        }

        const validated = bcrypt.compare(password, user.password);

        if (!validated) {
            throw createError.Unauthorized('Email address or password not valid');
        }

        return user;
    }

    static async all() {
        const allUsers = await prisma.user.findMany();
        return allUsers;
    }
}
