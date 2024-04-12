import { Router } from "express";
const ProductRouter = Router();
import ProductController from "../controllers/product.controller.js";
const productController = new ProductController();

ProductRouter.get("/", productController.getProducts);
ProductRouter.get("/:pid", productController.getProductById);
ProductRouter.post("/", productController.addProduct);
ProductRouter.put("/:pid", productController.updateProduct);
ProductRouter.delete("/:pid", productController.deleteProduct);

export default ProductRouter;
