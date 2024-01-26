import { promises as fs } from "fs";

class ProductManager {
  constructor() {
    this.products = [];
    this.path = "./src/models/products.json";
  }

  static newId = 0;

  addProduct = async ({
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  }) => {
    try {
      const arrayProducts = await this.readFile();

      if (!title || !description || !price || !code || !stock || !category) {
        console.log("All fields are required!");
        return;
      }

      if (arrayProducts.some((item) => item.code === code)) {
        console.log("This code is already been used.");
        return;
      }

      const newProduct = {
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || [],
      };

      if (arrayProducts.length > 0) {
        ProductManager.newId = arrayProducts.reduce(
          (maxId, product) => Math.max(maxId, product.id),
          0
        );
      }

      newProduct.id = ++ProductManager.newId;

      arrayProducts.push(newProduct);
      await this.saveFile(arrayProducts);
    } catch (error) {
      console.log("Product adding error", error);
      throw error;
    }
  };

  async getProducts() {
    try {
      const arrayProducts = await this.readFile();
      return arrayProducts;
    } catch (error) {
      console.log("Product reading error", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const arrayProducts = await this.readFile();
      const search = arrayProducts.find((item) => item.id === id);
      if (!search) {
        console.log("Item Not Found!");
        return null;
      } else {
        console.log("Item Found!");
        return search;
      }
    } catch (error) {
      console.log("File Reading Error", error);
      throw error;
    }
  }

  async readFile() {
    try {
      const response = await fs.readFile(this.path, "utf-8");
      const arrayProducts = JSON.parse(response);
      return arrayProducts;
    } catch (error) {
      console.log("File Reading Rrror", error);
      throw error;
    }
  }

  async saveFile(arrayProducts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
    } catch (error) {
      console.log("File saving error", error);
      throw error;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const arrayProducts = await this.readFile();
      const index = arrayProducts.findIndex((item) => item.id === id);
      if (index !== -1) {
        arrayProducts[index] = {
          ...arrayProducts[index],
          ...updatedProduct,
        };
        await this.saveFile(arrayProducts);
        console.log("Product upgraded");
      } else {
        console.log("Item Not Found");
      }
    } catch (error) {
      console.log("Update error", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProducts = await this.readFile();
      const index = arrayProducts.findIndex((item) => item.id === id);
      if (index !== -1) {
        arrayProducts.splice(index, 1);
        await this.saveFile(arrayProducts);
        console.log("Item Deleted");
      } else {
        console.log("Item Not Found");
      }
    } catch (error) {
      console.log("Deleting Error", error);
      throw error;
    }
  }
}

export default ProductManager;
