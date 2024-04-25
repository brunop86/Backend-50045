import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/user.controller.js";
const userController = new UserController();
const UserRouter = Router();

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

export default UserRouter;
