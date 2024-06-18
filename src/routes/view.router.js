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
  checkUserRole(["admin", "premium"]),
  viewController.renderRealTimeProducts
);
ViewRouter.get(
  "/chat",
  checkUserRole(["admin", "premium"]),
  viewController.renderChat
);
ViewRouter.get("/", viewController.renderHome);

ViewRouter.get("/reset-password", viewController.renderResetPassword);
ViewRouter.get("/password", viewController.renderChangePassword);
ViewRouter.get("/send-confirmation", viewController.renderConfirmation);
ViewRouter.get("/panel-premium", viewController.renderPremium);

module.exports = ViewRouter;
