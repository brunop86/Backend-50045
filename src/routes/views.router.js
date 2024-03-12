import { Router } from "express";
import ProductManager from "../controllers/ProductManagerDB.js";
import CartManager from "../controllers/CartManagerDB.js";
const productManager = new ProductManager();
const cartManager = new CartManager();

const ViewsRouter = Router();

ViewsRouter.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 3 } = req.query;
    const products = await productManager.getProducts({
      page: parseInt(page),
      limit: parseInt(limit),
    });
    const newArray = products.docs.map((product) => {
      const { _id, ...rest } = product.toObject();
      return rest;
    });

    res.render("products", {
      products: newArray,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      currentPage: products.page,
      totalPages: products.totalPages,
    });
  } catch (error) {
    console.error("Loading Products Error", error);
    res.status(500).json({
      status: "error",
      error: "Server Error",
    });
  }
});

ViewsRouter.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      console.log("Cart ID Not Found");
      return res.status(404).json({ error: "Cart Not Found" });
    }
    const productsInCart = cart.products.map((item) => ({
      product: item.product.toObject(),
      quantity: item.quantity,
    }));
    res.render("carts", { products: productsInCart });
  } catch (error) {
    console.error("Loading Cart Error", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Ruta para el formulario de login
ViewsRouter.get("/login", (req, res) => {
  if (req.session.login) {
    return res.redirect("/profile");
  }
  res.render("login");
});

// Ruta para el formulario de registro
ViewsRouter.get("/register", (req, res) => {
  if (req.session.login) {
    return res.redirect("/profile");
  }
  res.render("register");
});

// Ruta para la vista de perfil
ViewsRouter.get("/profile", (req, res) => {
  if (!req.session.login) {
    return res.redirect("/login");
  }
  res.render("profile", { user: req.session.user });
});

export default ViewsRouter;
