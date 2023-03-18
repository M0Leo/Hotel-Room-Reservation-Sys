import * as express from "express";
const router = express.Router();
import { PrismaClient } from '@prisma/client';
import { wrapAsync } from '../utils/utils'
import { auth } from "../middlewares/auth";
const prisma = new PrismaClient();

router.get("/", auth, wrapAsync(async (req: any, res: any) => {
    const guests = await prisma.guest.findMany();
    res.render("guest/index", { guests })
}))

router.put("/:id", wrapAsync(async (req: any, res: any) => {
    const data = req.body;
    const id = req.params.id;

    await prisma.guest.update({
        data: {
            ...data
        },
        where: { guestId: id }
    })

    res.redirect("guest/index")
}))

router.delete("/:id", wrapAsync(async (req: any, res: any) => {
    const id = req.params.id;

    await prisma.guest.delete({
        where: { guestId: id }
    })
    res.redirect("guest/index")
}))


export default router;
