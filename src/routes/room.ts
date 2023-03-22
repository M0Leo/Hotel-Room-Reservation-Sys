import * as express from "express";
const router = express.Router();
import { wrapAsync } from '../utils/utils'
import { auth } from "../middlewares/auth";
import { Room } from "../controllers/room.controller";


router.get("/", auth, wrapAsync(Room.findAll))
    .post("/", wrapAsync(Room.createOne))

router.get("/new", auth, wrapAsync(Room.renderNewRoom))

router.put("/:id", wrapAsync(Room.updateOne))
    .delete("/:id", wrapAsync(Room.deleteOne))

export default router;