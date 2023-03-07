import createError from "http-errors";

export class ExpressError extends Error {
    constructor(message: string, status: number) {
        super();
        createError(status, message);
    }
}

const err = new ExpressError("Not found", 301);