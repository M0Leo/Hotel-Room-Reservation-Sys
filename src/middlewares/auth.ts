import { Request, Response } from "express"

const createError = require('http-errors')
export const auth = async (req: Request, res: Response, next: any) => {
    if (!req.session.user) {
        return res.redirect("user/login")
    }

    next();
}

export const isAdmin = async (req: Request, res: Response, next: any) => {
    if (!req.session.user) {
        return res.redirect("user/login")
    }

    if (req.session.user.role != "ADMIN") {
        return next(createError.Unauthorized('For admins only'))
    }

    next();
}