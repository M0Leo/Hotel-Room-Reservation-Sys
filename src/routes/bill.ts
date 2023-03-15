import * as express from "express";
const router = express.Router();
import { PrismaClient } from '@prisma/client';
import { wrapAsync } from '../utils/utils';
const prisma = new PrismaClient();

router.get("/", wrapAsync(async (req: any, res: express.Response) => {
    const bills = await prisma.bill.findMany({ include: { Reservation: { include: { Guest: true } }, } });
    res.render('bills/index', { bills });
}))

router.put('/:id', wrapAsync(async (req: express.Request, res: any) => {
    const data = req.body;
    await prisma.bill.update({
        where: { invoiceNo: req.body.id },
        data: { ...data }
    })
}))

export default router;
