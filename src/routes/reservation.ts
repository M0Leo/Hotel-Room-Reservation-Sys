import * as express from "express";
const router = express.Router();
import { wrapAsync } from '../utils/utils';
import { auth } from "../middlewares/auth";
import { Reservation } from "../controllers/reservation.controller";

router.get("/", auth, wrapAsync(Reservation.findAll))
    .post("/", wrapAsync(Reservation.create));


router.get("/new", auth, wrapAsync(Reservation.renderNewReservation))

router.get('/:id', auth, wrapAsync(Reservation.findOne))
    .put('/:id', auth, wrapAsync(Reservation.upadteOne))
    .delete('/:id', auth, wrapAsync(Reservation.deleteOne))

router.post("/service/:id", wrapAsync(Reservation.getServiceById))

router.put('/bill/:id', wrapAsync(Reservation.pay))

router.get("/edit/:id", auth, wrapAsync(Reservation.renderEditReservation))

export default router;
