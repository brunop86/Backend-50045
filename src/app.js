import express from "express";
import multer from "multer";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import ProductRouter from "./routes/products.router.js";
import CartRouter from "./routes/carts.router.js";
import ViewsRouter from "./routes/views.router.js";
import SessionsRouter from "./routes/sessions.router.js";
import UserRouter from "./routes/user.router.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import "../src/database.js";

const app = express();
const PUERTO = 8080;

const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en http://localhost:${PUERTO}`);
});

const io = new Server(httpServer);

//Express-Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(
  session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://brunox86:coderhouse@cluster0.y6jrdwz.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0",
      ttl: 100,
    }),
  })
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/api/products", ProductRouter);
app.use("/api/carts", CartRouter);
app.use("/", ViewsRouter);
app.use("/api/users", UserRouter);
app.use("/api/sessions", SessionsRouter);

io.on("connection", (socket) => {
  console.log("New user on-line");
});

app.get("/createcookie", (req, res) => {
  res.cookie("cookie server", "This is a cookie").send("Cookie Created");
});

app.get("/deletecookie", (req, res) => {
  res.clearCookie("cookie server").send("Cookie Deleted");
});
