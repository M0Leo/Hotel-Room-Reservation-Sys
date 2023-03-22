import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class Guest {
    static findAll = async (req: any, res: any) => {
        const guests = await prisma.guest.findMany();
        res.render("guest/index", { guests })
    }

    static updateOne = async (req: any, res: any) => {
        const data = req.body;
        const id = req.params.id;

        await prisma.guest.update({
            data: {
                ...data
            },
            where: { guestId: id }
        })

        res.redirect("guest/index")
    }

    static deleteOne = async (req: any, res: any) => {
        const id = req.params.id;

        await prisma.guest.delete({
            where: { guestId: id }
        })
        res.redirect("guest/index")
    }
}