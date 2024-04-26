import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import ProductRouter from "./routes/products.router.js";
import CartRouter from "./routes/carts.router.js";
import ViewsRouter from "./routes/views.router.js";
import UserRouter from "./routes/user.router.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cors from "cors";
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
app.use(cors());

//Passport
app.use(passport.initialize());
initializePassport();
app.use(cookieParser());

//AuthMiddleware
import authMiddleware from "./middleware/authmiddleware.js";
app.use(authMiddleware);

//Routes
app.use("/api/products", ProductRouter);
app.use("/api/carts", CartRouter);
app.use("/api/users", UserRouter);
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

///Websockets:

import ProductRepository from "./repositories/products.repository.js";
const productRepository = new ProductRepository();
import MessageModel from "./models/messages.model.js";

class SocketManager {
  constructor(httpServer) {
    this.io = socket(httpServer);
    this.initSocketEvents();
  }

  async initSocketEvents() {
    this.io.on("connection", async (socket) => {
      console.log("Un cliente se conectó");

      socket.emit("products", await productRepository.getProducts());

      socket.on("deleteProduct", async (id) => {
        await productRepository.deleteProduct(id);
        this.emitUpdatedProducts(socket);
      });

      socket.on("addProduct", async (producto) => {
        await productRepository.addProduct(producto);
        this.emitUpdatedProducts(socket);
      });

      socket.on("message", async (data) => {
        await MessageModel.create(data);
        const messages = await MessageModel.find();
        socket.emit("message", messages);
      });
    });
  }

  async emitUpdatedProducts(socket) {
    socket.emit("products", await productRepository.getProducts());
  }
}
