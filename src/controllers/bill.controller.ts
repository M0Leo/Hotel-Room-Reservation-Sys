import * as express from "express";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class Bill {
    static findAll = async (req: any, res: express.Response) => {
        const bills = await prisma.bill.findMany({ include: { Reservation: { include: { Guest: true } }, } });
        res.render('bills/index', { bills });
    }

    static updateOne = async (req: express.Request, res: any) => {
        const data = req.body;
        await prisma.bill.update({
            where: { invoiceNo: req.body.id },
            data: { ...data }
        })
    }
}