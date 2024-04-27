const express = require("express");
const ViewRouter = express.Router();
const ViewsController = require("../controllers/view.controller.js");
const viewsController = new ViewsController();
const checkUserRole = require("../middleware/checkrole.js");
const passport = require("passport");

ViewRouter.get(
  "/products",
  checkUserRole(["user"]),
  passport.authenticate("jwt", { session: false }),
  viewsController.renderProducts
);

ViewRouter.get("/carts/:cid", viewsController.renderCart);
ViewRouter.get("/login", viewsController.renderLogin);
ViewRouter.get("/register", viewsController.renderRegister);
ViewRouter.get(
  "/realtimeproducts",
  checkUserRole(["admin"]),
  viewsController.renderRealTimeProducts
);
ViewRouter.get("/chat", checkUserRole(["user"]), viewsController.renderChat);
ViewRouter.get("/", viewsController.renderHome);

module.exports = ViewRouter;
