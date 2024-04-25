import { Router } from "express";
const CartRouter = Router();
import CartController from "../controllers/cart.controller.js";
const cartController = new CartController();
import authMiddleware from "../middleware/authmiddleware.js";

CartRouter.use(authMiddleware);

CartRouter.post("/", cartController.addCart);
CartRouter.get("/:cid", cartController.getCartById);
CartRouter.post("/:cid/product/:pid", cartController.addProductToCart);
CartRouter.delete("/:cid/product/:pid", cartController.deleteProductCart);
CartRouter.put("/:cid", cartController.updateCart);
CartRouter.put("/:cid/product/:pid", cartController.updateQuantityProduct);
CartRouter.delete("/:cid", cartController.emptyCart);

export default CartRouter;
