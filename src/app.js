import express from "express";
import multer from "multer";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import ProductRouter from "./routes/products.router.js";
import CartRouter from "./routes/carts.router.js";
import ViewsRouter from "./routes/views.router.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import "../src/database.js";

const fileStore = FileStore(session);

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
    secret: "secretcoder",
    resave: true,
    saveUninitialized: true,

    store: new fileStore({ path: "./src/sessions", ttl: 100, retries: 1 }),
  })
);

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

app.get("/login", (req, res) => {
  let user = req.query.user;
  req.session.user = user;
  res.send("User saved");
});

app.get("/user", (req, res) => {
  if (req.session.user) {
    return res.send(`User logged: ${req.session.user}`);
  }
  res.send("User Not Found");
});
