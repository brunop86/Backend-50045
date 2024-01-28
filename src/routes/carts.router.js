import { Router } from "express";
import CartManager from "../controllers/CartManager.js";

const CartRouter = Router();
const cartManager = new CartManager("./src/models/carts.json");

CartRouter.post("/api/carts", async (req, res) => {
  try {
    const newCart = await cartManager.addCart();
    res.json(newCart);
  } catch (error) {
    console.error("New Cart Fail", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

CartRouter.get("/api/carts/:cid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  try {
    const cart = await cartManager.getCartById(cartId);
    res.json(cart.products);
  } catch (error) {
    console.error("Cart Loading Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

  CartRouter.post("/api/carts/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = req.params.pid;
    const quantity = req.params.quantity || 1;
    try {
      const updateCart = await cartManager.addProductToCart(
        cartId,
        productId,
        quantity
      );
      res.json(updateCart.products);
    } catch (error) {
      console.error("Item Adding Error", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

export default CartRouter;
