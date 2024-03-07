import express from "express";
import multer from "multer";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import ProductRouter from "./routes/products.router.js";
import CartRouter from "./routes/carts.router.js";
import ViewsRouter from "./routes/views.router.js";
import cookieParser from "cookie-parser";
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

//Routes
app.use("/api/products", ProductRouter);
app.use("/api/carts", CartRouter);
app.use("/", ViewsRouter);

io.on("connection", (socket) => {
  console.log("New user on-line");
});

app.get("/createcookie", (req, res) => {
  res.cookie("cookie server", "This is a cookie").send("Cookie Created");
});

app.get("/deletecookie", (req, res) => {
  res.clearCookie("cookie server").send("Cookie Deleted");
});
