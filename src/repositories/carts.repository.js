const CartModel = require("../models/cart.model.js");

class CartRepository {
  async addNewCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error("Error");
    }
  }

  async getProductsOfCart(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        console.log("Cart ID Not Found");
        return null;
      }
      return cart;
    } catch (error) {
      throw new Error("Error");
    }
  }

  async addProduct(cartId, productId, quantity = 1) {
    try {
      const cart = await this.getProductsOfCart(cartId);
      const existProduct = cart.products.find(
        (item) => item.product._id.toString() === productId
      );
      if (existProduct) {
        existProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error");
    }
  }

  async deleteProduct(cartId, productId) {
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
      throw new Error("Error");
    }
  }

  async updateProductsInCart(cartId, updatedProducts) {
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
      throw new Error("Error");
    }
  }

  async updateQuantityProduct(cartId, productId, newQuantity) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error("Cart Not Found");
      }
      const productIndex = cart.products.findIndex(
        (item) => item._id.toString() === productId
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
      throw new Error("Quantity Update Error");
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
      throw new Error("Error");
    }
  }
}

module.exports = CartRepository;
