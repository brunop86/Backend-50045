import { Router } from "express";
import CartManager from "../controllers/CartManagerDB.js";
import CartModel from "../models/carts.model.js";

const CartRouter = Router();
const cartManager = new CartManager();

CartRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.addCart();
    res.json(newCart);
  } catch (error) {
    console.error("New Cart Fail", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

CartRouter.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      console.log("Item Not found");
      return res.status(404).json({ error: "Cart Not Found" });
    }
    return res.json(cart.products);
  } catch (error) {
    console.error("Cart Loading Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

  CartRouter.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
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

CartRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const updatedCart = await cartManager.deleteProductCart(cartId, productId);
    res.json({
      status: "success",
      message: "Product Deleted",
      updatedCart,
    });
  } catch (error) {
    console.error("Deleting Product Error", error);
    res.status(500).json({
      status: "error",
      error: "Internal Server Error",
    });
  }
});

CartRouter.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const updatedProducts = req.body;
  try {
    const updatedCart = await cartManager.updateCart(cartId, updatedProducts);
    res.json(updatedCart);
  } catch (error) {
    console.error("Upgrade Cart Error", error);
    res.status(500).json({
      status: "error",
      error: "Internal Server Error",
    });
  }
});

CartRouter.put("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;
    const updatedCart = await cartManager.updateQuantityProduct(
      cartId,
      productId,
      newQuantity
    );
    res.json({
      status: "success",
      message: "Product Quantity Upgraded",
      updatedCart,
    });
  } catch (error) {
    console.error("Upgrade Quantity Error", error);
    res.status(500).json({
      status: "error",
      error: "Internal Server Error",
    });
  }
});

CartRouter.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const updatedCart = await cartManager.emptyCart(cartId);
    res.json({
      status: "success",
      message: "The Cart is Empty",
      updatedCart,
    });
  } catch (error) {
    console.error("Cart Cleaning Error", error);
    res.status(500).json({
      status: "error",
      error: "Internal Server Error",
    });
  }
});

export default CartRouter;
