import express from "express";
import ProductRouter from "./routes/products.router.js";
import CartRouter from "./routes/carts.router.js"

const app = express();
const PUERTO = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", ProductRouter)
app.use("/", CartRouter)

app.listen(PUERTO, () => {
  console.log(`Escucuchando en http://localhost:${PUERTO}`);
});
