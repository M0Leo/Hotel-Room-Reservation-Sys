import express, { Request } from "express";
import path from "path";
import reservation from "./routes/reservation"
import room from "./routes/room";
import guest from "./routes/guest";
import bill from "./routes/bill";
import user from "./routes/user";
import methodOverride from 'method-override';
import session, { SessionOptions } from 'express-session';
import flash from "express-flash";
import { config } from "./config";
import { error404 } from "./middlewares/404";
const app = express();
const engine = require('ejs-mate');
const port = process.env.PORT || 3000;

app.engine('ejs', engine);
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));

//session options
const sessionConfig: SessionOptions = {
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: parseInt(config.sessionCookieMaxAge),
    }
}

type User = {
    id: number;
    username: string;
    role: string;
};

// Augment express-session with a custom SessionData object
declare module "express-session" {
    interface SessionData {
        user: User;
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use((req: Request, res: any, next: any) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});


//routes
app.use("/reservation", reservation);
app.use("/room", room);
app.use("/guest", guest);
app.use("/bill", bill);
app.use("/user", user);

app.get("/", (req: any, res: any) => {
    res.render('index');
})

app.all("*", error404)

app.use((err: any, req: any, res: any, next: any) => {
    const { status = 500 } = err;
    if (!err.message) {
        let message = "Something went wrong";
        let pair = { status: status, message: message }
        err = { ...err, ...pair }
    }
    res.status(err.status).render('error', { err });
})

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
