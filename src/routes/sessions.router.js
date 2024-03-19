import { Router } from "express";
import passport from "passport";
import { isValidPassword } from "../utils/hashbcryp.js";
import UserModel from "../models/user.model.js";

const SessionsRouter = Router();

SessionsRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error" });
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    };
    req.session.login = true;
    res.redirect("/products");
  }
);

SessionsRouter.get("/faillogin", async (req, res) => {
  res.send({ error: "Login Failed" });
});

SessionsRouter.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.redirect("/login");
});

//GitHub

SessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

SessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
  }
);

export default SessionsRouter;
