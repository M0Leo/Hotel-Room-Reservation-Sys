import * as express from "express";
const router = express.Router();
import { PrismaClient } from '@prisma/client';
import createError from "http-errors";
import Joi from "joi";
const prisma = new PrismaClient();

export class Room {
    static findAll = async (req: any, res: any) => {
        const rooms = await prisma.room.findMany();
        const availables = await roomsAvailable(new Date().toISOString(), new Date().toISOString());
        res.render("rooms/index", { rooms, availables })
    }

    static createOne = async (req: any, res: express.Response, next: any) => {
        const roomSchema = Joi.object({
            roomId: Joi.number().min(200).required(),
            type: Joi.string().required()
        }).required()

        const { error } = roomSchema.validate(req.body);
        if (error) {
            const msg = error.details.map(elm => elm.message).join(',');
            next(createError(400, msg));
        }

        try {
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
        } catch {
            next(createError(401, "Room Already exists!"));
        }
    }

    static renderNewRoom = async (req: any, res: any) => {
        res.render("rooms/new")
    }

    static updateOne = async (req: any, res: any) => {
        const data = req.body;
        const id = req.body.id;

        await prisma.room.update({
            data: {
                ...data
            },
            where: { roomId: id }
        })
    }

    static deleteOne = async (req: any, res: any) => {
        const id = req.body.id;

        await prisma.room.delete({
            where: { roomId: id }
        })
    }
}

export async function roomsAvailable(start: string, end: string) {
    const rooms = await prisma.room.findMany({
        select: {
            roomId: true
        }, where: {
            Reservation: {
                none: {
                    AND: {
                        checkIn: {
                            lte: new Date(start).toISOString()
                        },
                        checkOut: {
                            gte: new Date(end).toISOString()
                        }
                    }
                },
                every: {
                    type: { not: "Canceled" }
                }
            }
        }
    }
    )
    return rooms;
}
