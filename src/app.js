import express from "express";
import multer from "multer";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import ProductRouter from "./routes/products.router.js";
import CartRouter from "./routes/carts.router.js";
import ViewsRouter from "./routes/views.router.js";
import "../src/database.js";

const app = express();
const PUERTO = 8080;

const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en http://localhost:${PUERTO}`);
});

//Express-Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "./src/public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "./src/public/img");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
app.use(multer({ storage }).single("image"));

//Routes
app.use("/api/products", ProductRouter);
app.use("/api/carts", CartRouter);
app.use("/", ViewsRouter);

const io = new Server(httpServer);
