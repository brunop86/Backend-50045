const express = require("express");
const ViewRouter = express.Router();
const ViewController = require("../controllers/view.controller.js");
const viewController = new ViewController();
const checkUserRole = require("../middleware/checkrole.js");
const passport = require("passport");

ViewRouter.get(
  "/products",
  checkUserRole(["user"]),
  passport.authenticate("jwt", { session: false }),
  viewController.renderProducts
);

ViewRouter.get("/carts/:cid", viewController.renderCart);
ViewRouter.get("/login", viewController.renderLogin);
ViewRouter.get("/register", viewController.renderRegister);
ViewRouter.get(
  "/realtimeproducts",
  checkUserRole(["admin"]),
  viewController.renderRealTimeProducts
);
ViewRouter.get("/chat", checkUserRole(["user"]), viewController.renderChat);
ViewRouter.get("/", viewController.renderHome);

module.exports = ViewRouter;
