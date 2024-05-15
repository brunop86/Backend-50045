const ProductRepository = require("../repositories/products.repository.js");
const productRepository = new ProductRepository();
const CartRepository = require("../repositories/carts.repository.js");
const cartRepository = new CartRepository();
const TicketModel = require("../models/ticket.model.js");
const UserModel = require("../models/user.model.js");
const { generateUniqueCode, calculateTotal } = require("../utils/cartutils.js");
const { sendPurchaseEmail } = require("../services/email.js");

class CartController {
  async addNewCart(req, res) {
    try {
      const newCart = await cartRepository.addNewCart();
      res.json(newCart);
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async getProductsOfCart(req, res) {
    const cartId = req.params.cid;
    try {
      const products = await cartRepository.getProductsOfCart(cartId);
      if (!products) {
        return res.status(404).json({ error: "Cart Not Found" });
      }
      res.json(products);
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async addProductInCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
      await cartRepository.addProduct(cartId, productId, quantity);
      const cartID = req.user.cart.toString();
      res.redirect(`/carts/${cartID}`);
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async deleteProductOfCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
      const updatedCart = await cartRepository.deleteProduct(cartId, productId);
      res.json({
        status: "success",
        message: "Product Deleted",
        updatedCart,
      });
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async updateProductsInCart(req, res) {
    const cartId = req.params.cid;
    const updatedProducts = req.body;
    try {
      const updatedCart = await cartRepository.updateProductsInCart(
        cartId,
        updatedProducts
      );
      res.json(updatedCart);
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async updateQuantityProduct(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;
    try {
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
      res.status(500).send("Upgrade Quantity Error");
    }
  }

  async emptyCart(req, res) {
    const cartId = req.params.cid;
    try {
      const updatedCart = await cartRepository.emptyCart(cartId);
      res.json({
        status: "success",
        message: "The Cart is Empty",
        updatedCart,
      });
    } catch (error) {
      res.status(500).send("Error");
    }
  }

  async finishPurchase(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartRepository.getProductsOfCart(cartId);
      const products = cart.products;
      const productsNotAvaliable = [];
      for (const item of products) {
        const productId = item.product;
        const product = await productRepository.getProductById(productId);
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
        purchaser: userWithCart._id,
      });
      await ticket.save();
      cart.products = cart.products.filter((item) =>
        productsNotAvaliable.some((productId) => productId.equals(item.product))
      );
      await cart.save();

      await sendPurchaseEmail(
        userWithCart.email,
        userWithCart.first_name,
        ticket._id
      );

      res.render("checkout", {
        client: userWithCart.first_name,
        email: userWithCart.email,
        ticketNumber: ticket._id,
      });
      // res.status(200).json({ productsNotAvaliable });
    } catch (error) {
      console.error("Purchase Error", error);
      res.status(500).json({ error: "Server Error" });
    }
  }
}

module.exports = CartController;
