import * as express from "express";
const router = express.Router();
import { PrismaClient } from '@prisma/client';
import { wrapAsync } from '../utils/utils';
import { auth } from "../middlewares/auth";
import { Bill } from "../controllers/bill.controller";
const prisma = new PrismaClient();

router.get("/", auth, wrapAsync(Bill.findAll))

router.put('/:id', wrapAsync(Bill.updateOne))

export default router;
