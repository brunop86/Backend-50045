import ProductModel from "../models/products.model.js";

class ProductManager {
  async addProduct({
    title,
    description,
    price,
    img,
    code,
    stock,
    category,
    thumbnails,
  }) {
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        console.log("All fields are required!");
        return;
      }

      const productFound = await ProductModel.findOne({ code: code });
      if (productFound) {
        console.log("The code must be unique");
        return;
      }

      const newProduct = new ProductModel({
        title,
        description,
        code,
        price,
        img,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || [],
      });
      await newProduct.save();
    } catch (error) {
      console.log("Product adding error", error);
      throw error;
    }
  }

  async getProducts() {
    try {
      const arrayProducts = await ProductModel.find();
      return arrayProducts;
    } catch (error) {
      console.log("Product reading error", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        console.log("Item Not Found!");
        return null;
      }
      console.log("Item Found!");
      return product;
    } catch (error) {
      console.log("Item ID reading error", error);
      throw error;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const product = await ProductModel.findByIdAndUpdate(id, updatedProduct);
      if (!product) {
        console.log("Item Not Found");
        return null;
      }
      console.log("Product upgraded");
      return product;
    } catch (error) {
      console.log("Update error", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const product = await ProductModel.findByIdAndDelete(id);
      if (!product) {
        console.log("Item Not Found");
        return null;
      }
      console.log("Product deleted");
    } catch (error) {
      console.log("Deleting error", error);
      throw error;
    }
  }
}

export default ProductManager;
