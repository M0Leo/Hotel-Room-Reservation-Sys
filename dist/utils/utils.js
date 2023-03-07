"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapAsync = exports.roomsAvailable = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function roomsAvailable() {
    return __awaiter(this, void 0, void 0, function* () {
        const rooms = yield prisma.room.findMany({
            select: {
                roomId: true
            }, where: {
                Reservation: {
                    none: {
                        AND: {
                            checkIn: {
                                lte: new Date().toISOString()
                            },
                            checkOut: {
                                gte: new Date().toISOString()
                            }
                        }
                    },
                    every: {
                        type: { not: "Canceled" }
                    }
                }
            }
        });
        return rooms;
    });
}
exports.roomsAvailable = roomsAvailable;
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((e) => next(e.message));
    };
}
exports.wrapAsync = wrapAsync;
//# sourceMappingURL=utils.js.map