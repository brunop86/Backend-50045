import { promises as fs } from "fs";

class CartManager {
  constructor() {
    this.path = "./src/models/carts.json";
  }

  static cartId = 0;

  async readCart() {
    try {
      const response = await fs.readFile(this.path, "utf-8");
      const cartProducts = JSON.parse(response);
      return cartProducts;
    } catch (error) {
      console.log("File Reading Rrror", error);
      throw error;
    }
  }

  async saveCart(cartProduct) {
    try {
      await fs.writeFile(this.path, JSON.stringify(cartProduct, null, 2));
    } catch (error) {
      console.log("File saving error", error);
      throw error;
    }
  }

  async addCarts() {
    const oldCart = await this.readCart();
    //let id = cartId;
    const newCart = [{ id: id, products: [] }, ...oldCart];
    await this.saveCart(newCart);
    return "New Cart Added";
  }
}

export default CartManager;
