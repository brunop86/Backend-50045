import { Router } from "express";
import ProductManager from "../controllers/ProductManagerDB.js";

const ProductRouter = Router();
const productManager = new ProductManager();

ProductRouter.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    console.log("Products Loading Error", error);
    res.status(500).json({ error: "Server Error" });
  }
});

ProductRouter.get("/:pid", async (req, res) => {
  let id = req.params.pid;
  try {
    const product = await productManager.getProductById(id);
    if (!product) {
      res.json({
        error: "Item Not Found",
      });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.log("Products Loading Error", error);
    res.status(500).json({ error: "Server Error" });
  }
});

ProductRouter.post("/", async (req, res) => {
  const newProduct = req.body;
  try {
    await productManager.addProduct(newProduct),
      res.status(201).json({ message: "Product Added Successfully!" });
  } catch (error) {
    console.log("Product Saving Error", error);
    res.status(500).json({ error: "Server Error" });
  }
});

ProductRouter.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const productUpdated = req.body;
  try {
    await productManager.updateProduct(id, productUpdated);
    res.json({ message: "Product Upgraded Successfully!" });
  } catch (error) {
    console.log("Update Error", error);
    res.status(500).json({ error: "Server Internal Error" });
  }
});

ProductRouter.delete("/:pid", async (req, res) => {
  const id = req.params.pid;
  try {
    await productManager.deleteProduct(id);
    res.json({ message: "Product Deleted!" });
  } catch (error) {
    console.error("Delete Error", error);
    res.status(500).json({ error: "Server Internal Error" });
  }
});

export default ProductRouter;
