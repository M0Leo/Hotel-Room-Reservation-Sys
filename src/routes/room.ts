import * as express from "express";
const router = express.Router();
import { wrapAsync } from '../utils/utils'
import { auth } from "../middlewares/auth";
import { Room } from "../controllers/room.controller";


router.get("/", auth, wrapAsync(Room.findAll))
    .post("/", auth, wrapAsync(Room.createOne))

router.get("/new", auth, wrapAsync(Room.renderNewRoom))

router.put("/:id", auth, wrapAsync(Room.updateOne))
    .delete("/:id", auth, wrapAsync(Room.deleteOne))

export default router;