import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";

const ProductRouter = Router();
const productManager = new ProductManager("./src/models/products.json");

ProductRouter.get("/api/products", async (req, res) => {
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

ProductRouter.get("/api/products/:pid", async (req, res) => {
  let id = req.params.pid;
  try {
    const product = await productManager.getProductById(parseInt(id));
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

ProductRouter.post("/api/products", async (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  try {
    await productManager.addProduct(newProduct),
      res.status(201).json({ message: "Product Added Successfully!" });
  } catch (error) {
    console.log("Product Saving Error", error);
    res.status(500).json({ error: "Server Error" });
  }
});

ProductRouter.put("/api/products/:pid", async (req, res) => {
  let id = req.params.pid;
  const productUpdated = req.body;
  try {
    await productManager.updateProduct(parseInt(id), productUpdated);
    res.json({ message: "Product Upgraded Successfully!" });
  } catch (error) {
    console.log("Update Error", error);
    res.status(500).json({ error: "Server Error" });
  }
});

ProductRouter.delete("/api/products/:pid", async (req, res) => {
  let id = req.params.pid;
  const arrayProducts = req.body;
  await productManager.deleteProduct(parseInt(id), arrayProducts);
  res.json({ message: "Product Deleted!" });
});

export default ProductRouter;
