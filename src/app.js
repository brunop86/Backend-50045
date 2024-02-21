import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import ProductRouter from "./routes/products.router.js";
import CartRouter from "./routes/carts.router.js";
import ViewsRouter from "./routes/views.router.js";
import ProductManager from "./controllers/ProductManager.js";
import "./database.js";

const app = express();
const PUERTO = 8080;

const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en http://localhost:${PUERTO}`);
});

const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use("/api/products", ProductRouter);
app.use("/api/carts", CartRouter);
app.use("/", ViewsRouter);

const productManager = new ProductManager("./src/models/products.json");

io.on("connection", async (socket) => {
  console.log("Un cliente se conectó");
  socket.emit("products", await productManager.getProducts());

  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    io.sockets.emit("products", await productManager.getProducts());
  });

  socket.on("addProduct", async (product) => {
    await productManager.addProduct(product);
    io.sockets.emit("products", await productManager.getProducts());
  });
});