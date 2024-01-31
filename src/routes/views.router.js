import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";

const ViewsRouter = Router();
const productManager = new ProductManager("./src/models/products.json");

ViewsRouter.get("/", async (req, res) => {
  const allproducts = await productManager.getProducts();
  res.render("home", { products: allproducts });
});

export default ViewsRouter;
