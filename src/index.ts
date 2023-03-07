import express from "express";
import path from "path";
import reservation from "./routes/reservation"
import room from "./routes/room";
import guest from "./routes/guest";
import bill from "./routes/bill";
import methodOverride from 'method-override';
import createError from 'http-errors';

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
