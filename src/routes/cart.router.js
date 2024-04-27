const express = require("express");
const CartRouter = express.Router();
const CartController = require("../controllers/cart.controller.js");
const authMiddleware = require("../middleware/authmiddleware.js");
const cartController = new CartController();

CartRouter.use(authMiddleware);

CartRouter.post("/", cartController.addCart);
CartRouter.get("/:cid", cartController.getCartById);
CartRouter.post("/:cid/product/:pid", cartController.addProductToCart);
CartRouter.delete("/:cid/product/:pid", cartController.deleteProductCart);
CartRouter.put("/:cid", cartController.updateCart);
CartRouter.put("/:cid/product/:pid", cartController.updateQuantityProduct);
CartRouter.delete("/:cid", cartController.emptyCart);

module.exports = CartRouter;
