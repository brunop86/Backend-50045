import CartRepository from "../repositories/carts.repository.js";
const cartRepository = new CartRepository();

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
}

export default CartController;
