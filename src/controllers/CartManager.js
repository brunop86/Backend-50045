import { promises as fs } from "fs";

class CartManager {
  constructor() {
    this.path = "./src/models/carts.json";
    this.carts = [];
    this.newId = 0;
    this.loadCarts;
  }

  async loadCarts() {
    try {
      const response = await fs.readFile(this.path, "utf-8");
      this.carts = JSON.parse(response);
      if (this.carts.length > 0) {
        this.newId = Math.max(...this.carts.map((cart) => cart.id));
      }
    } catch (error) {
      console.error("Cart Loading Error", error);
      await this.loadCarts();
    }
  }

  async saveCarts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.log("Cart Saving Error", error);
      throw error;
    }
  }

  async addCart() {
    const newCart = {
      id: ++this.newId,
      products: [],
    };
    this.carts.push(newCart);
    await this.saveCarts();
    return newCart;
  }

  async getCartById(cartId) {
    try {
      const cart = this.carts.find((cart) => cart.id === cartId);
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
    const cart = await this.getCartById(cartId);
    const productFound = cart.products.find(
      (product) => product.id === productId
    );
    if (productFound) {
      productFound.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
    await this.saveCarts();
    return cart;
  }
}

export default CartManager;
