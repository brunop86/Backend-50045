const express = require("express");
const passport = require("passport");
const ProductRouter = express.Router();
const ProductController = require("../controllers/product.controller.js");
const productController = new ProductController();

ProductRouter.get("/", productController.getProducts);
ProductRouter.get("/:pid", productController.getProductById);
ProductRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  productController.addProduct
);
ProductRouter.put("/:pid", productController.updateProduct);
ProductRouter.delete("/:pid", productController.deleteProduct);

module.exports = ProductRouter;
