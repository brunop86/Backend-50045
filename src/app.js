import express from "express";
import { engine } from "express-handlebars";
import ProductRouter from "./routes/products.router.js";
import CartRouter from "./routes/carts.router.js";
import ViewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";

const app = express();
const PUERTO = 8080;

const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en http://localhost:${PUERTO}`);
});

const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", ProductRouter);
app.use("/api/carts", CartRouter);
app.use("/", ViewsRouter);

io.on("connection", (socket) => {
  console.log("Un cliente se conectó");
  socket.on("mensaje", (data) => {
    console.log(data);
  });
});
