const express = require("express");
const UserRouter = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();
const UserRepository = require("../repositories/users.repository.js");
const userRepository = new UserRepository();

UserRouter.get("/", userController.getAllUsers);
UserRouter.delete("/", userController.deleteInactiveUsers);
UserRouter.put("/:id/role", userController.updateUserRole);  
UserRouter.delete("/:id", userController.deleteUser);

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
UserRouter.post("/requestPasswordReset", userController.requestPasswordReset);
UserRouter.post("/reset-password", userController.resetPassword);
UserRouter.put("/premium/:uid", userController.changeRolePremium);

const upload = require("../middleware/multer.js");

UserRouter.post(
  "/:uid/documents",
  upload.fields([
    { name: "document" },
    { name: "products" },
    { name: "profile" },
  ]),
  async (req, res) => {
    const { uid } = req.params;
    const uploadedDocuments = req.files;

    try {
      const user = await userRepository.findById(uid);

      if (!user) {
        return res.status(404).send("User Not Found");
      }

      if (uploadedDocuments) {
        if (uploadedDocuments.document) {
          user.documents = user.documents.concat(
            uploadedDocuments.document.map((doc) => ({
              name: doc.originalname,
              reference: doc.path,
            }))
          );
        }

        if (uploadedDocuments.products) {
          user.documents = user.documents.concat(
            uploadedDocuments.products.map((doc) => ({
              name: doc.originalname,
              reference: doc.path,
            }))
          );
        }

        if (uploadedDocuments.profile) {
          user.documents = user.documents.concat(
            uploadedDocuments.profile.map((doc) => ({
              name: doc.originalname,
              reference: doc.path,
            }))
          );
        }
      }
      await user.save();
      res.status(200).send("Documents uploaded successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Mocking
const generateProducts = require("../utils/faker.js");

UserRouter.get("/mockingproducts", (req, res) => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProducts());
  }
  res.json(products);
});

const { generateInfoError } = require("../services/errors/info.js");
const { EErrors } = require("../services/errors/enums.js");
const CustomError = require("../services/errors/custom-error.js");

//Manejo de Errores
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

module.exports = UserRouter;
