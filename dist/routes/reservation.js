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
const prisma = new client_1.PrismaClient();
router.get("/", (0, utils_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reservations = yield prisma.reservation.findMany({ include: { Room: true, Guest: true, Bill: { include: { Service: true } } } });
    res.render("reservation/index", { reservations });
})));
router.get("/new", (0, utils_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield (0, utils_1.roomsAvailable)();
    res.render('reservation/new', { rooms });
})));
router.post("/service/:id", (0, utils_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { name, price, quantity, type } = req.body;
    yield prisma.service.create({
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
    });
    res.redirect(`/reservation/${+id}`);
})));
router.post("/", (0, utils_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, phone, checkIn, checkOut, type, visitors, room, nationality, total, paymentMode } = req.body;
    const rooms = yield (0, utils_1.roomsAvailable)();
    if (rooms.find(r => r.roomId === +room)) {
        yield prisma.reservation.create({
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
        });
        res.redirect("/reservation");
    }
    else {
        res.send("Room already reserved!");
    }
})));
router.put('/bill/:id', (0, utils_1.wrapAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { val } = req.body;
    const id = parseInt(req.params.id);
    const { Bill: { remaining } } = yield prisma.reservation.findUnique({ where: { reservationId: id }, select: { Bill: true } });
    if (parseFloat(val) > remaining) {
        next((0, http_errors_1.default)(400, "Payment amount is greater than remaining amount"));
    }
    yield prisma.reservation.update({
        where: { reservationId: id }, data: {
            Bill: {
                update: {
                    remaining: { decrement: parseFloat(val) },
                    paid: { increment: parseFloat(val) }
                }
            }
        }
    });
    res.redirect(`/reservation/${id}`);
})));
router.get('/:id', (0, utils_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const reservation = yield prisma.reservation.findUnique({ where: { reservationId: +id }, include: { Bill: { include: { Service: true } }, Guest: true, Room: true } });
    const totalServiceAmount = reservation.Bill.Service.reduce((total, service) => {
        return service.price + total;
    }, 0);
    res.render('reservation/one', { reservation, totalServiceAmount });
})));
router.get("/edit/:id", (0, utils_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const reservation = yield prisma.reservation.findUnique({ where: { reservationId: +id }, include: { Bill: true, Guest: true, Room: true } });
    const rooms = yield (0, utils_1.roomsAvailable)();
    res.render("reservation/edit", { reservation, rooms });
})));
router.put('/:id', (0, utils_1.wrapAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone, address, nationality, checkIn, checkOut, visitors, type, total, remaining, paid, paymentMode } = req.body;
    const id = req.params.id;
    yield prisma.reservation.update({
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
    });
    res.redirect(`/reservation/${id}`);
})));
router.delete('/:id', (0, utils_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.reservation.delete(req.params.id);
})));
exports.default = router;
//# sourceMappingURL=reservation.js.map