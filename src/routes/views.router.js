import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";

const ViewsRouter = Router();
const productManager = new ProductManager("./src/models/products.json");

ViewsRouter.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

ViewsRouter.get("/realtimeproducts", async (req, res) => {
  res.render("realtimeproducts");
});

export default ViewsRouter;
