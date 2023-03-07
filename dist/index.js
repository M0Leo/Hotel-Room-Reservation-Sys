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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const reservation_1 = __importDefault(require("./routes/reservation"));
const room_1 = __importDefault(require("./routes/room"));
const guest_1 = __importDefault(require("./routes/guest"));
const bill_1 = __importDefault(require("./routes/bill"));
const method_override_1 = __importDefault(require("method-override"));
const http_errors_1 = __importDefault(require("http-errors"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const port = 3000;
const app = (0, express_1.default)();
const engine = require('ejs-mate');
app.engine('ejs', engine);
app.use(express_1.default.json());
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, method_override_1.default)('_method'));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/reservation", reservation_1.default);
app.use("/room", room_1.default);
app.use("/guest", guest_1.default);
app.use("/bill", bill_1.default);
app.get("/", (req, res) => {
    res.render('index');
});
app.all("*", (req, res, next) => {
    next((0, http_errors_1.default)(404, 'Not Found'));
});
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) {
        let message = "Something went wrong";
        let pair = { status: status, message: message };
        err = Object.assign(Object.assign({}, err), pair);
    }
    res.status(err.status).render('error', { err });
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.reservation.deleteMany();
    });
}
//main();
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map