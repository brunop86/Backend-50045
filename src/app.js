import express from "express";
import { engine } from "express-handlebars";
import ProductRouter from "./routes/products.router.js";
import CartRouter from "./routes/carts.router.js";
import ViewsRouter from "./routes/views.router.js";

const app = express();
const PUERTO = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/", ProductRouter);
app.use("/", CartRouter);
app.use("/", ViewsRouter);

app.listen(PUERTO, () => {
  console.log(`Escucuchando en http://localhost:${PUERTO}`);
});
