const fs = require("fs").promises;

class ProductManager {
  constructor() {
    this.products = [];
    this.path = "./products.json";
  }

  static id = 0;

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    const newProduct = {
      id: ++ProductManager.id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
  };

  readProducts = async () => {
    try {
      const response = await fs.readFile(this.path, "utf-8");
      const arrayProducts = JSON.parse(response);
      return arrayProducts;
    } catch {
      console.log("File Reading Error", error);
    }
  };

  getProducts = async () => {
    let response2 = await this.readProducts();
    return console.log(response2);
  };

  getProductsById = async (id) => {
    let response3 = await this.readProducts();
    if (!response3.find((item) => item.id === id)) {
      console.log("Item Not Found!");
    } else {
      console.log(response3.find((item) => item.id === id));
    }
  };

  deleteProducstById = async (id) => {
    let response3 = await this.readProducts();
    let productFilter = response3.filter((item) => item.id != id);
    await fs.writeFile(this.path, JSON.stringify(productFilter));
    console.log("Item Deleted!");
  };

  updateProduct = async ({ id, ...item }) => {
    await this.deleteProducstById(id);
    let oldProduct = await this.readProducts();
    let modifiedProducts = [{ ...item, id }, ...oldProduct];
    await fs.writeFile(this.path, JSON.stringify(modifiedProducts));
  };
}
/*-----Testing-----*/

// Instancia de la clase “ProductManager”
const items = new ProductManager();

// Lamada al método “addProduct”
items.addProduct(
  "Producto prueba 1",
  "Este es un producto prueba 1",
  200,
  "thumbnail1",
  "abc123",
  25
);

items.addProduct(
  "Producto prueba 2",
  "Este es un producto prueba 2",
  200,
  "thumbnail2",
  "abc124",
  25
);

// Llamada al método “getProducts”
items.getProducts();

// Se evaluará que getProductById devuleva el producto en caso de encontrarlo
items.getProductsById(1);
items.getProductsById(5);

// Llamada al método para eliminar un item
items.deleteProducstById(1);

// Actualizar un item
items.updateProduct({
  title: "Producto prueba 1",
  description: "Este es un producto prueba 1",
  price: 4500,
  thumbnail: "thumbnail1",
  code: "abc123",
  stock: 25,
  id: 0,
});
