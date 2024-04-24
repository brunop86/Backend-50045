import CartRepository from "../repositories/carts.repository.js";
const cartRepository = new CartRepository();
import ProductRepository from "../repositories/products.repository.js";
const productRepository = new ProductRepository();
import TicketModel from "../models/tickets.model.js";
import UserModel from "../models/user.model.js";
import { generateUniqueCode, calculateTotal } from "../utils/cartutils.js";

class CartController {
  async addCart(req, res) {
    try {
      const newCart = await cartRepository.addCart();
      res.json(newCart);
    } catch (error) {
      console.error("New Cart Fail", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getCartById(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartRepository.findById(cartId);
      if (!cart) {
        console.log("Item Not found");
        return res.status(404).json({ error: "Cart Not Found" });
      }
      return res.json(cart.products);
    } catch (error) {
      console.error("Cart Loading Error", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async addProductToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
      const updateCart = await cartRepository.addProductToCart(
        cartId,
        productId,
        quantity
      );
      res.json(updateCart.products);
    } catch (error) {
      console.error("Item Adding Error", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async deleteProductCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const updatedCart = await cartRepository.deleteProductCart(
        cartId,
        productId
      );
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
  }

  async updateCart(req, res) {
    const cartId = req.params.cid;
    const updatedProducts = req.body;
    try {
      const updatedCart = await cartRepository.updateCart(
        cartId,
        updatedProducts
      );
      res.json(updatedCart);
    } catch (error) {
      console.error("Upgrade Cart Error", error);
      res.status(500).json({
        status: "error",
        error: "Internal Server Error",
      });
    }
  }

  async updateQuantityProduct(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const newQuantity = req.body.quantity;
      const updatedCart = await cartRepository.updateQuantityProduct(
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
  }

  async emptyCart(req, res) {
    try {
      const cartId = req.params.cid;
      const updatedCart = await cartRepository.emptyCart(cartId);
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
  }

  async finishPurchase(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartRepository.getCartById(cartId);
      const products = cart.products;
      const productsNotAvaliable = [];
      for (const item of products) {
        const productId = item.product;
        const product = await productRepository.addProductToCart(productId);
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
        } else {
          productsNotAvaliable.push(productId);
        }
      }
      const userWithCart = await UserModel.findOne({ cart: cartId });
      const ticket = new TicketModel({
        code: generateUniqueCode(),
        purchase_datetime: new Date(),
        amount: calculateTotal(cart.products),
        purchaser: userWithCart.email,
      });
      await ticket.save();
      cart.products = cart.products.filter((item) =>
        productsNotAvaliable.some((productId) => productId.equals(item.product))
      );

      await cart.save();

      res.status(200).json({ productsNotAvaliable });
    } catch (error) {
      console.error("Purchase Error", error);
      res.status(500).json({ error: "Server Error" });
    }
  }
}

export default CartController;
