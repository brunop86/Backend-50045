import CartModel from "../models/carts.model.js";
import ProductModel from "../models/products.model.js";

class CartManager {
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
        throw new Error(`Cart Id ${cartId} Not Found`);
      }
      return cart;
    } catch (error) {
      console.error("Id Match Error", error);
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await CartModel.findById(cartId);
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

  async deleteProduct(cartId, productId) {
    try {
      let prod = await ProductModel.findById(productId);

      return await CartModel.updateOne(
        { _id: cartId },
        { $pull: { products: { product: prod } } }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAllProducts(cartId) {
    try {
      return await CartModel.updateOne({ _id: cartId }, { products: [] });
    } catch (error) {
      console.log(error);
    }
  }
}

export default CartManager;
