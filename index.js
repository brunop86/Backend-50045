class ProductManager {
  constructor() {
    this.products = [];
  }

  static id = 0;

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("All fields are required");
      return;
    }

    if (this.products.some((item) => item.code === code)) {
      console.log("This code is already been used");
      return;
    }

    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      id: ProductManager.id++,
    };

    this.products.push(newProduct);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((item) => item.id === id);

    if (!product) {
      console.error("Item Not Found!");
    } else {
      console.log(product);
    }
  }
}
/*-----Testing-----*/

// Instancia de la clase “ProductManager”
const items = new ProductManager();

// Llamada a "getProducts" con un array vacio
console.log(items.getProducts());

// Lamada al método “addProduct” con los siguientes campos
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

// Llamada al método “addProduct”, debe arrojar un error porque el código estará repetido.
items.addProduct(
  "Producto prueba 3",
  "Este es un producto prueba 3",
  200,
  "thumbnail3",
  "abc123",
  25
);

// Llamada al método “getProducts” nuevamente, con el producto recién agregado
console.log(items.getProducts());

// Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo
items.getProductById(3);
