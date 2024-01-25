import express from "express";
import ProductRouter from "./routes/products.router.js";

const app = express();
const PUERTO = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", ProductRouter)

app.listen(PUERTO, () => {
  console.log(`Escucuchando en http://localhost:${PUERTO}`);
});
