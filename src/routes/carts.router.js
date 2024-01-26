import { Router } from "express";
import CartManager from "../controllers/CartManager.js";

const CartRouter = Router();
const carts = new CartManager();

CartRouter.post("/api/carts", async (req, res) => {
  res.send(await carts.addCarts());
});

CartRouter.get("/api/carts", async (req, res) => {
  res.send(await carts.readCart());
});

CartRouter.get("/api/carts/:cid", async (req, res) => {
    res.send(await carts.getCartById(req.params.cid));
  });

export default CartRouter;
