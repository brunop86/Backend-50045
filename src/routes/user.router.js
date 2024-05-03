const express = require("express");
const UserRouter = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();

const generateProducts = require("../utils/faker.js");

UserRouter.get("/mockingproducts", (req, res) => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProducts());
  }
  res.json(products);
});

const { generateInfoError } = require("../services-errors/info.js");
const { EErrors } = require("../services-errors/enums.js");
const CustomError = require("../services-errors/custom-error.js");

const arrayUsuarios = [];

UserRouter.post("/", async (req, res, next) => {
  const { nombre, apellido, email } = req.body;
  try {
    if (!nombre || !apellido || !email) {
      throw CustomError.createError({
        nombre: "Usuario Nuevo",
        causa: generateInfoError({ nombre, apellido, email }),
        mensaje: "Error al intentar crear un usuario",
        codigo: EErrors.TIPO_INVALIDO,
      });
    }

    const usuario = {
      nombre,
      apellido,
      email,
    };

    arrayUsuarios.push(usuario);
    console.log(arrayUsuarios);
    res.send({ status: "success", payload: usuario });
  } catch (error) {
    next(error);
  }
});

UserRouter.post("/register", userController.register);
UserRouter.post("/login", userController.login);
UserRouter.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.profile
);
UserRouter.post("/logout", userController.logout.bind(userController));
UserRouter.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  userController.admin
);

module.exports = UserRouter;
