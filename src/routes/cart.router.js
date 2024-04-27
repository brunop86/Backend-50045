const express = require("express");
const CartRouter = express.Router();
const CartController = require("../controllers/cart.controller.js");
const authMiddleware = require("../middleware/authmiddleware.js");
const cartController = new CartController();

CartRouter.use(authMiddleware);

CartRouter.post("/", cartController.addNewCart);
CartRouter.get("/:cid", cartController.getProductsOfCart);
CartRouter.post("/:cid/product/:pid", cartController.addProductInCart);
CartRouter.delete("/:cid/product/:pid", cartController.deleteProductOfCart);
CartRouter.put("/:cid", cartController.updateProductsInCart);
CartRouter.put("/:cid/product/:pid", cartController.updateQuantityProduct);
CartRouter.delete("/:cid", cartController.emptyCart);
CartRouter.post("/:cid/purchase", cartController.finishPurchase);

module.exports = CartRouter;
