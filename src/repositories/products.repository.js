import ProductModel from "../models/products.model.js";

class ProductRepository {
  async loadAll() {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error) {
      throw new Error("Loadind Product Error");
    }
  }

  async crear(productoData) {
    try {
      return await ProductModel.create(productoData);
    } catch (error) {
      throw new Error("Add Product Error");
    }
  }
}

export default ProductRepository;
