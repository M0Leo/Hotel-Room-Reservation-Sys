import * as express from "express";
const router = express.Router();
import { PrismaClient } from '@prisma/client';
import { wrapAsync } from '../utils/utils'
import { auth } from "../middlewares/auth";
import { Guest } from "../controllers/guest.controller";
const prisma = new PrismaClient();

router.get("/", auth, wrapAsync(Guest.findAll))

router.route('/:id')
    .put(auth, wrapAsync(Guest.updateOne))
    .delete(auth, wrapAsync(Guest.deleteOne))

export default router;
