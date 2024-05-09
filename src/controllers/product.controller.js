const ProductRepository = require("../repositories/products.repository.js");
const productRepository = new ProductRepository();

class ProductController {
  async getProducts(req, res) {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
      const products = await productRepository.getProducts({
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
        query,
      });
      res.json({
        status: "success",
        payload: products,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage
          ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`
          : null,
        nextLink: products.hasNextPage
          ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`
          : null,
      });
    } catch (error) {
      req.looger.error("Products Loading Error", error);
      res.status(500).json({ error: "Server Error" });
    }
  }

  async getProductById(req, res) {
    const id = req.params.pid;
    try {
      const product = await productRepository.findById(id);
      if (!product) {
        res.json({
          error: "Item Not Found",
        });
      } else {
        res.json(product);
      }
    } catch (error) {
      req.logger.error("Products Loading Error", error);
      res.status(500).json({ error: "Server Error" });
    }
  }

  async addProduct(req, res) {
    const newProduct = req.body;
    try {
      await productRepository.addProduct(newProduct),
        res.status(201).json({ message: "Product Added Successfully!" });
    } catch (error) {
      req.logger.error("Product Saving Error", error);
      res.status(500).json({ error: "Server Error" });
    }
  }

  async updateProduct(req, res) {
    const id = req.params.pid;
    const productUpdated = req.body;
    try {
      await productRepository.updateProduct(id, productUpdated);
      res.json({ message: "Product Upgraded Successfully!" });
    } catch (error) {
      req.logger.error("Update Error", error);
      res.status(500).json({ error: "Server Internal Error" });
    }
  }

  async deleteProduct(req, res) {
    const id = req.params.pid;
    try {
      await productRepository.deleteProduct(id);
      res.json({ message: "Product Deleted!" });
    } catch (error) {
      req.logger.error("Delete Error", error);
      res.status(500).json({ error: "Server Internal Error" });
    }
  }
}

module.exports = ProductController;
