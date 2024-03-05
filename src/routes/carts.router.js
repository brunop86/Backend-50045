import { Router } from "express";
import CartManager from "../controllers/CartManagerDB.js";

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
    const cart = await cartManager.getCartById(cartId);
    res.json(cart.products);
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
    let { cid, pid } = req.params;
    let cart = await CartManager.deleteProduct(cid, pid);

    res.status(200).send({
      status: "success",
      message: "Product Deleted Successfully",
      payload: cart,
    });
  } catch (error) {
    console.log(error);
  }
});

CartRouter.delete("/:cid", async (req, res) => {
  try {
    let { cid } = req.params;
    let cart = await CartManager.deleteAllProd(cid);

    !cart
      ? res.status(404).send({
          status: "error",
          message: "Cart Not Found",
        })
      : res.status(200).send({
          status: "success",
          message: "The Cart is Empty",
          payload: cart,
        });
  } catch (error) {
    console.log(error);
  }
});

export default CartRouter;
