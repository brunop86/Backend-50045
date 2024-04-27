const CartModel = require("../models/cart.model.js");

class CartRepository {
  async addCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.log("Cart Saving Error", error);
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        console.log("Cart ID Not Found");
        return null;
      }
      return cart;
    } catch (error) {
      console.error("Id Match Error", error);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await this.getCartById(cartId);
      const productFound = cart.products.find(
        (item) => item.product.toString() === productId
      );
      if (productFound) {
        productFound.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Adding Product Error", error);
      throw error;
    }
  }

  async deleteProductCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error("Cart Not Found");
      }
      cart.products = cart.products.filter(
        (item) => item.product._id.toString() !== productId
      );
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Cart Deleting Error", error);
      throw error;
    }
  }

  async updateCart(cartId, updatedProducts) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error("Cart Not Found");
      }
      cart.products = updatedProducts;
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Update Cart Error", error);
      throw error;
    }
  }

  async updateQuantityProduct(cartId, productId, newQuantity) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error("Cart Not Found");
      }
      const productIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === productId
      );
      if (productIndex !== -1) {
        cart.products[productIndex].quantity = newQuantity;
        cart.markModified("products");
        await cart.save();
        return cart;
      } else {
        throw new Error("Product Not Found");
      }
    } catch (error) {
      console.error("Quantity Update Error", error);
      throw error;
    }
  }

  async emptyCart(cartId) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );
      if (!cart) {
        throw new Error("Cart Not Found");
      }
      return cart;
    } catch (error) {
      console.error("Error", error);
      throw error;
    }
  }
}

module.exports = CartRepository;
