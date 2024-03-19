import { Router } from "express";
import passport from "passport";
import { isValidPassword } from "../utils/hashbcryp.js";
import UserModel from "../models/user.model.js";

const SessionsRouter = Router();

SessionsRouter.post("/login", async (request, response) => {
  const { email, password } = request.body;
  if (email == "adminCoder@coder.com" && password == "adminCoder123") {
    request.session.login = true;
    request.session.user = {
      email: email,
      password: password,
      first_name: "admin",
      last_name: "coder",
      rol: "admin",
    };
    response.redirect("/products");
  } else {
    try {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        if (isValidPassword(password, user)) {
          request.session.login = true;
          request.session.user = { ...user._doc };
          response.redirect("/products");
        } else {
          response.status(401).send({ error: "Invalid Password" });
        }
      } else {
        response.status(404).send({ error: "User Not Found" });
      }
    } catch (error) {
      response.status(404).send({ error: "Login Error" });
    }
  }
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
