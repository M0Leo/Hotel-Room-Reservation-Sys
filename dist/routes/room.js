"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const router = express.Router();
const client_1 = require("@prisma/client");
const utils_1 = require("../utils/utils");
const http_errors_1 = __importDefault(require("http-errors"));
const joi_1 = __importDefault(require("joi"));
const prisma = new client_1.PrismaClient();
router.get("/", (0, utils_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield prisma.room.findMany();
    const availables = yield (0, utils_1.roomsAvailable)();
    res.render("rooms/index", { rooms, availables });
})));
router.get("/new", (0, utils_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("rooms/new");
})));
router.post("/", (0, utils_1.wrapAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const roomSchema = joi_1.default.object({
        roomId: joi_1.default.number().min(200).required(),
        type: joi_1.default.string().required()
    }).required();
    const { error } = roomSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(elm => elm.message).join(',');
        next((0, http_errors_1.default)(400, msg));
    }
    const { roomId, type } = req.body;
    const rooms = yield prisma.room.findMany();
    if (!rooms.find(room => room.roomId === +roomId)) {
        yield prisma.room.create({
            data: {
                roomId: +roomId,
                type,
            }
        });
        res.redirect("/room");
    }
    next((0, http_errors_1.default)(401, "Room Already exists!"));
})));
router.put("/:id", (0, utils_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const id = req.body.id;
    yield prisma.room.update({
        data: Object.assign({}, data),
        where: { roomId: id }
    });
})));
router.delete("/:id", (0, utils_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    yield prisma.room.delete({
        where: { roomId: id }
    });
})));
exports.default = router;
//# sourceMappingURL=room.js.map