import { NextFunction, Request, Response } from "express";
import creatError from "http-errors";

export const error404 = (_: Request, __: Response, next: NextFunction) => {
    next(creatError(404, "Page not found"));
}
