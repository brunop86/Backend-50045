const ProductModel = require("../models/product.model.js");
const CartRepository = require("../repositories/carts.repository.js");
const cartRepository = new CartRepository();

class ViewController {
  async renderProducts(req, res) {
    try {
      const { page = 1, limit = 3 } = req.query;
      const skip = (page - 1) * limit;
      const products = await ProductModel.find().skip(skip).limit(limit);
      const totalProducts = await ProductModel.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      const newArray = products.map((product) => {
        const { _id, ...rest } = product.toObject();
        return { id: _id, ...rest };
      });
      const cartId = req.user.cart.toString();

      res.render("products", {
        productos: newArray,
        hasPrevPage,
        hasNextPage,
        prevPage: page > 1 ? parseInt(page) - 1 : null,
        nextPage: page < totalPages ? parseInt(page) + 1 : null,
        currentPage: parseInt(page),
        totalPages,
        cartId,
      });
    } catch (error) {
      console.error("Loading Product Error", error);
      res.status(500).json({
        status: "error",
        error: "Server Error",
      });
    }
  }

  async renderCart(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartRepository.addProductToCart(cartId);

      if (!cart) {
        console.log("Cart ID Not Found");
        return res.status(404).json({ error: "Cart Not Found" });
      }

      let totalPurchase = 0;

      const productsInCart = cart.products.map((item) => {
        const product = item.product.toObject();
        const quantity = item.quantity;
        const totalPrice = product.price * quantity;

        totalPurchase += totalPrice;

        return {
          product: { ...product, totalPrice },
          quantity,
          cartId,
        };
      });

      res.render("carts", {
        productos: productsInCart,
        totalPurchase,
        cartId,
      });
    } catch (error) {
      console.error("Loadind Cart Error", error);
      res.status(500).json({ error: "Server Error" });
    }
  }

  async renderLogin(req, res) {
    res.render("login");
  }

  async renderRegister(req, res) {
    res.render("register");
  }

  async renderRealTimeProducts(req, res) {
    try {
      res.render("realtimeproducts");
    } catch (error) {
      console.log("Real Time View Error", error);
      res.status(500).json({ error: "Server Error" });
    }
  }

  async renderChat(req, res) {
    res.render("chat");
  }

  async renderHome(req, res) {
    res.render("home");
  }
}

module.exports = ViewController;
