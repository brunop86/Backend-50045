const ProductModel = require("../models/product.model.js");

class ProductRepository {
  async addProduct({
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
    owner,
  }) {
    try {
      if (!title || !description || !code || !price || !stock || !category) {
        console.log("All fields are required!");
        return;
      }

      const productFound = await ProductModel.findOne({ code: code });
      if (productFound) {
        console.log("The code must be unique");
        return;
      }
      console.log("Owner", owner);

      const newProduct = new ProductModel({
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || [],
        owner,
      });
      await newProduct.save();
    } catch (error) {
      console.log("Product adding error", error);
      throw error;
    }
  }

  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    try {
      const skip = (page - 1) * limit;
      let queryOptions = {};
      if (query) {
        queryOptions = { category: query };
      }
      const sortOptions = {};
      if (sort) {
        if (sort === "asc" || sort === "desc") {
          sortOptions.price = sort === "asc" ? 1 : -1;
        }
      }

      const products = await ProductModel.find(queryOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
      const totalProducts = await ProductModel.countDocuments(queryOptions);
      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      return {
        docs: products,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage
          ? `/api/products?limit=${limit}&page=${
              page - 1
            }&sort=${sort}&query=${query}`
          : null,
        nextLink: hasNextPage
          ? `/api/products?limit=${limit}&page=${
              page + 1
            }&sort=${sort}&query=${query}`
          : null,
      };
    } catch (error) {
      console.log("Loading Products Error", error);
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
      throw new Error("Error");
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
      return product;
    } catch (error) {
      console.log("Deleting error", error);
      throw new Error("Error");
    }
  }
}

module.exports = ProductRepository;
