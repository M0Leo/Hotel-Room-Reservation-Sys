import express from "express";
import path from "path";
import reservation from "./routes/reservation"
import room from "./routes/room";
import guest from "./routes/guest";
import bill from "./routes/bill";
import methodOverride from 'method-override';
import createError from 'http-errors';
import session, { SessionOptions } from 'express-session';

const port = 3000;
const app = express();
const engine = require('ejs-mate');


app.engine('ejs', engine);
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig: SessionOptions = {
    secret: "ket",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

app.use("/reservation", reservation);
app.use("/room", room);
app.use("/guest", guest);
app.use("/bill", bill);

app.get("/", (req: any, res: any) => {
    res.render('index');
})


app.all("*", (req, res, next) => {
    next(createError(404, 'Not Found'))
})

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
