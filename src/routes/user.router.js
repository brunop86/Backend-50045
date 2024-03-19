import { Router } from "express";
import UserModel from "../models/user.model.js";
import { createHash } from "../utils/hashbcryp.js";

const UserRouter = Router();

UserRouter.post("/", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    const userExists = await UserModel.findOne({ email: email });
    if (userExists) {
      return res.status(400).send({ error: "Error! Email Registered" });
    }

    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      password: createHash(password),
      rol: "user",
    });

    req.session.login = true;
    req.session.user = { ...newUser._doc };
    res.redirect("/products");
  } catch (error) {
    console.log("Error creating the user: ", error);
    res.status(500).send({ error: "Error saving the new user" });
  }
});

export default UserRouter;
