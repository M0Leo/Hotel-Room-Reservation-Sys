"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressError = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
class ExpressError extends Error {
    constructor(message, status) {
        super();
        (0, http_errors_1.default)(status, message);
    }
}
exports.ExpressError = ExpressError;
const err = new ExpressError("Not found", 301);
//# sourceMappingURL=ExpressError.js.map