import * as express from "express";
const router = express.Router();
import { roomsAvailable, wrapAsync } from '../utils/utils';
import { auth } from "../middlewares/auth";
import { Reservation } from "../controllers/reservation.controller";

router.get("/", auth, wrapAsync(Reservation.findAll))
    .post("/", wrapAsync(Reservation.create));

router.get('/:id', auth, wrapAsync(Reservation.findOne))
    .put('/:id', wrapAsync(Reservation.upadteOne))
    .delete('/:id', wrapAsync(Reservation.deleteOne))

router.get("/new", auth, wrapAsync(Reservation.renderNewReservation))

router.post("/service/:id", wrapAsync(Reservation.getServiceById))

router.put('/bill/:id', wrapAsync(Reservation.pay))

router.get("/edit/:id", auth, wrapAsync(Reservation.renderEditReservation))

export default router;
