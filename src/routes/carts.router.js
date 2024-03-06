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
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const updatedCart = await cartManager.eliminarProductoDelCarrito(
      cartId,
      productId
    );
    res.json({
      status: "success",
      message: "Producto eliminado del carrito correctamente",
      updatedCart,
    });
  } catch (error) {
    console.error("Error al eliminar el producto del carrito", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

CartRouter.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const updatedProducts = req.body;
  // Debes enviar un arreglo de productos en el cuerpo de la solicitud

  try {
    const updatedCart = await cartManager.actualizarCarrito(
      cartId,
      updatedProducts
    );
    res.json(updatedCart);
  } catch (error) {
    console.error("Error al actualizar el carrito", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

CartRouter.put("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    const updatedCart = await cartManager.actualizarCantidadDeProducto(
      cartId,
      productId,
      newQuantity
    );

    res.json({
      status: "success",
      message: "Cantidad del producto actualizada correctamente",
      updatedCart,
    });
  } catch (error) {
    console.error(
      "Error al actualizar la cantidad del producto en el carrito",
      error
    );
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

CartRouter.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const updatedCart = await cartManager.vaciarCarrito(cartId);

    res.json({
      status: "success",
      message:
        "Todos los productos del carrito fueron eliminados correctamente",
      updatedCart,
    });
  } catch (error) {
    console.error("Error al vaciar el carrito", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

export default CartRouter;
