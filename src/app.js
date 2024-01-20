const express = require("express");
const app = express();
const PUERTO = 8080;

const ProductManager = require("../src/controllers/ProductManager.js");

const products = new ProductManager();
const readProducts = products.readProducts();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/products", async (req, res) => {
  let limit = parseInt(req.query.limit);
  if (!limit) return res.send(await readProducts);
  let allProducts = await readProducts;
  let productLimit = allProducts.slice(0, limit);
  res.send(await productLimit);
});

app.get("/products/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  let allProducts = await readProducts;
  let productsById = allProducts.find((product) => product.id == id);
  res.send(productsById);
});

app.listen(PUERTO, () => {
  console.log(`Escucuchando en http://localhost:${PUERTO}`);
});
