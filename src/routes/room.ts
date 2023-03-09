import * as express from "express";
const router = express.Router();
import { PrismaClient } from '@prisma/client';
import { roomsAvailable, wrapAsync } from '../utils/utils'
import createError from "http-errors";
import Joi from "joi";
const prisma = new PrismaClient();


router.get("/", wrapAsync(async (req: any, res: any) => {
    const rooms = await prisma.room.findMany();
    const availables = await roomsAvailable();
    res.render("rooms/index", { rooms, availables })
}))

router.get("/new", wrapAsync(async (req: any, res: any) => {
    res.render("rooms/new")
}))

router.post("/", wrapAsync(async (req: any, res: express.Response, next: any) => {
    const roomSchema = Joi.object({
        roomId: Joi.number().min(200).required(),
        type: Joi.string().required()
    }).required()

    const { error } = roomSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(elm => elm.message).join(',');
        next(createError(400, msg));
    }

    const { roomId, type } = req.body;
    const rooms = await prisma.room.findMany();
    if (!rooms.find(room => room.roomId === +roomId)) {
        await prisma.room.create({
            data: {
                roomId: +roomId,
                type,
            }
        });
        req.flash('success', `Successfully created new room!`);
        res.redirect("/room");
    }
    next(createError(401, "Room Already exists!"));
}))

router.put("/:id", wrapAsync(async (req: any, res: any) => {
    const data = req.body;
    const id = req.body.id;

    await prisma.room.update({
        data: {
            ...data
        },
        where: { roomId: id }
    })
}))

router.delete("/:id", wrapAsync(async (req: any, res: any) => {
    const id = req.body.id;

    await prisma.room.delete({
        where: { roomId: id }
    })
}))

export default router;