import { Express } from "express";
import creatError from "http-errors";

export default function error404(app: Express) {
    app.use((req, res, next) => next(creatError(404)));
}
