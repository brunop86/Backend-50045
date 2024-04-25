import { Router } from "express";
import ViewsController from "../controllers/view.controller.js";
const viewsController = new ViewsController();
import checkUserRole from "../middleware/checkrole.js";
import passport from "passport";

const ViewsRouter = Router();

ViewsRouter.get(
  "/products",
  checkUserRole(["usuario"]),
  passport.authenticate("jwt", { session: false }),
  viewsController.renderProducts
);

ViewsRouter.get("/carts/:cid", viewsController.renderCart);
ViewsRouter.get("/login", viewsController.renderLogin);
ViewsRouter.get("/register", viewsController.renderRegister);
ViewsRouter.get(
  "/realtimeproducts",
  checkUserRole(["admin"]),
  viewsController.renderRealTimeProducts
);
ViewsRouter.get("/chat", checkUserRole(["user"]), viewsController.renderChat);
ViewsRouter.get("/", viewsController.renderHome);

export default ViewsRouter;
