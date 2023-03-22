import * as express from "express";
import { wrapAsync } from "../utils/utils";
import bcrypt from "bcryptjs";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = express.Router();
import createError from 'http-errors';
import { isAdmin, auth } from "../middlewares/auth";

router.post('/register', isAdmin, wrapAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let { username, password, role } = req.body;
    console.log(req.body)
    password = bcrypt.hashSync(password, 12);
    await prisma.user.create({
        data: {
            username,
            password,
            role
        }
    });
    res.redirect('/user');
}))

router.post('/login', wrapAsync(async (req: express.Request, res: express.Response, next: any) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            username
        }
    })

    if (!user) {
        req.flash('error', 'Incorrect username');
        res.redirect('back')
    }

    bcrypt.compare(password, user.password, function (err: any, success: any) {
        if (success) {
            req.flash('success', 'Logged in successfully')
            req.session.user = user;
            res.redirect("/")
        }
        else {
            req.flash('error', 'Incorrect password');
            res.redirect('back')
        }
    })
}))

router.get('/logout', wrapAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    req.session.user = undefined;
    res.redirect('/');
}))

router.get('/', isAdmin, wrapAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const users = await prisma.user.findMany();
    res.render('user/index', { users });
}))

router.get('/register', isAdmin, wrapAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.render('user/register');
}))

router.get('/login', wrapAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    req.flash('error', `You should login first.`);
    res.render('user/login');
}))

export default router;
