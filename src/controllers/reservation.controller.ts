import { Request, Response, NextFunction } from "express";
import * as express from "express";
const router = express.Router();
import { PrismaClient } from '@prisma/client';
import { roomsAvailable, wrapAsync } from '../utils/utils';
import createError from "http-errors";
import { auth } from "../middlewares/auth";
const prisma = new PrismaClient();

export class Reservation {

    static findAll = async (req: Request, res: Response, next: any) => {
        const reservations = await prisma.reservation.findMany({ include: { Room: true, Guest: true, Bill: { include: { Service: true } } } });
        res.render("reservation/index", { reservations })
    }

    static create = async (req: Request, res: Response, next: any) => {
        const { name, address, phone, checkIn, checkOut, type, visitors, room, nationality, total, paymentMode } = req.body;
        const rooms = await roomsAvailable(checkIn, checkOut);
        if (rooms.find(r => r.roomId === +room)) {
            await prisma.reservation.create({
                data: {
                    checkIn: new Date(checkIn).toISOString(),
                    checkOut: new Date(checkOut).toISOString(),
                    type,
                    visitors: +visitors,
                    Guest: {
                        create: {
                            name,
                            nationality,
                            phone,
                            address,
                        }
                    },
                    Room: {
                        connect: {
                            roomId: +room,
                        }
                    },
                    Bill: {
                        create: {
                            paymentMode,
                            total: +total,
                            remaining: +total,
                        }
                    }
                }
            })
            req.flash('success', 'Successfully made a new reservation!');
            res.redirect("/reservation")
        }
        else {
            res.send("Room already reserved!");
        }
    }

    static findOne = async (req: Request, res: Response, next: any) => {
        const id = req.params.id;
        try {
            const reservation = await prisma.reservation.findUnique({ where: { reservationId: +id }, include: { Bill: { include: { Service: true } }, Guest: true, Room: true } });
            const totalServiceAmount = reservation.Bill.Service.reduce((total, service) => {
                return service.price + total;
            }, 0);
            res.render('reservation/one', { reservation, totalServiceAmount })
        } catch {
            next(createError(404, "Not found reservation"));
        }
    }

    static upadteOne = async (req: Request, res: Response, next: any) => {
        const { name, phone, address, nationality, checkIn, checkOut, visitors, type, total, remaining, paid, paymentMode } = req.body;
        const id = req.params.id;

        await prisma.reservation.update({
            where: { reservationId: parseInt(req.params.id) },
            data: {
                Bill: {
                    update: {
                        paid: +paid,
                        remaining: +remaining,
                        total: +total,
                        paymentMode,
                    }
                },
                Guest: {
                    update: {
                        address,
                        name,
                        nationality,
                        phone,
                    }
                },
                checkIn: new Date(checkIn).toISOString(),
                checkOut: new Date(checkOut).toISOString(),
                type,
                visitors: +visitors,
            }
        })
        req.flash('success', `Successfully updated!`);
        res.redirect(`/reservation/${id}`);
    }

    static deleteOne = async (req: Request, res: Response, next: any) => {
        await prisma.reservation.delete({ where: { reservationId: parseInt(req.params.id) } });
    }

    static getServiceById = async (req: Request, res: Response, next: any) => {
        const id = req.params.id;
        const { name, price, quantity, type } = req.body;
        await prisma.service.create({
            data: {
                name,
                price: +price,
                quantity: +quantity,
                type,
                Bill: {
                    connect: {
                        reservationId: +id
                    }
                }
            }
        })
        res.redirect(`/reservation/${+id}`);
    }

    static renderNewReservation = async (req: Request, res: Response, next: any) => {
        const rooms = await roomsAvailable(new Date().toISOString(), new Date().toISOString());
        res.render('reservation/new', { rooms });
    }

    static renderEditReservation = async (req: Request, res: Response, next: any) => {
        const id = req.params.id;
        const reservation = await prisma.reservation.findUnique({ where: { reservationId: +id }, include: { Bill: true, Guest: true, Room: true } });
        const rooms = await roomsAvailable(new Date().toISOString(), new Date().toISOString());
        res.render("reservation/edit", { reservation, rooms })
    }

    static pay = async (req: Request, res: Response, next: any) => {
        const { val } = req.body;
        const id = parseInt(req.params.id);
        try {
            const { Bill: { remaining } } = await prisma.reservation.findUnique({ where: { reservationId: id }, select: { Bill: true } });


            if (parseFloat(val) > remaining) {
                next(createError(400, "Payment amount is greater than remaining amount"));
            }

            await prisma.reservation.update({
                where: { reservationId: id }, data: {
                    Bill: {
                        update: {
                            remaining: { decrement: parseFloat(val) },
                            paid: { increment: parseFloat(val) }
                        }
                    }
                }
            });
            req.flash('success', `Successfully paid ${val}`);
            res.redirect(`/reservation/${id}`);
        }
        catch {
            next(createError(404, "Not found bill"));
        }
    }

}