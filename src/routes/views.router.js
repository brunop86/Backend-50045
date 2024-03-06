import { Router } from "express";

const ViewsRouter = Router();

ViewsRouter.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 2 } = req.query;
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
    const carrito = await cartManager.getCarritoById(cartId);
    if (!carrito) {
      console.log("No existe ese carrito con el id");
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    const productosEnCarrito = carrito.products.map((item) => ({
      product: item.product.toObject(),
      //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars.
      quantity: item.quantity,
    }));
    res.render("carts", { productos: productosEnCarrito });
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default ViewsRouter;
