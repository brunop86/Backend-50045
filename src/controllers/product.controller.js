import ProductRepository from "../repositories/products.repository.js";
const productRepository = new ProductRepository();

class ProductController {
  async getProducts(req, res) {
    try {
      const products = await productRepository.loadAll();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json("Server Error");
    }
  }

  async postProducts(req, res) {
    const newProduct = req.body;
    try {
      await productRepository.crear(newProduct);
      res.status(200).send("Product Added");
    } catch (error) {
      res.status(500).json("Server Error");
    }
  }
}

export default ProductController;
