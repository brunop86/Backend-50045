const express = require("express");
const UserRouter = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();

const generateUsers = require("../utils/util.js");

UserRouter.get("/mockingproducts", (req, res) => {
  const users = [];

  for(let i = 0; i < 10; i++) {
      users.push(generateUsers());
  }
  res.json(users);
})

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
