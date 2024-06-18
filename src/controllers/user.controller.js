const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");
const UserDTO = require("../dto/user.dto.js");
const { generateTokenReset } = require("../utils/tokenreset.js");
const EmailManager = require("../services/email.js");
const emailManager = new EmailManager();
const UserRepository = require("../repositories/users.repository.js");
const userRepository = new UserRepository();

class UserController {
  async register(req, res) {
    const { first_name, last_name, email, password, age } = req.body;
    try {
      const existUser = await userRepository.findByEmail(email);
      if (existUser) {
        return res.status(400).send("User Already Registered");
      }
      const newCart = new CartModel();
      await newCart.save();
      const newUser = new UserModel({
        first_name,
        last_name,
        email,
        cart: newCart._id,
        password: createHash(password),
        age,
      });

      await userRepository.create(newUser);

      const token = jwt.sign({ user: newUser }, "coderhouse", {
        expiresIn: "1h",
      });

      res.cookie("coderCookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.redirect("/api/users/profile");
    } catch (error) {
      req.logger.error("Error");
      res.status(500).send("Server Internal Error");
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const userFound = await userRepository.findByEmail(email);

      if (!userFound) {
        return res.status(401).send("Not Valid User");
      }

      const isValid = isValidPassword(password, userFound);
      if (!isValid) {
        return res.status(401).send("Incorrect Password");
      }

      const token = jwt.sign({ user: userFound }, "coderhouse", {
        expiresIn: "1h",
      });

      userFound.last_connection = new Date();
      await userFound.save();

      res.cookie("coderCookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.redirect("/api/users/profile");
    } catch (error) {
      req.logger.error("Error");
      res.status(500).send("Server Error");
    }
  }

  async profile(req, res) {
    try {
      const isPremium = req.user.role === "premium";
      const userDto = new UserDTO(
        req.user.first_name,
        req.user.last_name,
        req.user.role
      );
      const isAdmin = req.user.role === "admin";
      res.render("profile", { user: userDto, isPremium, isAdmin });
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }

  async logout(req, res) {
    if (req.user) {
      try {
        req.user.last_connection = new Date();
        await req.user.save();
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
        return;
      }
    }
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
  }

  async admin(req, res) {
    if (req.user.user.role !== "admin") {
      return res.status(403).send("Access Denied");
    }
    res.render("admin");
  }

  async requestPasswordReset(req, res) {
    const { email } = req.body;
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return res.status(404).send("User Not Found");
      }

      const token = generateTokenReset();
      user.resetToken = {
        token: token,
        expire: new Date(Date.now() + 3600000),
      };
      await userRepository.save(user);

      await emailManager.sendRestoreEmail(email, user.first_name, token);

      res.redirect("/send-confirmation");
    } catch (error) {
      res.status(500).send("Server Internal Error");
    }
  }

  async resetPassword(req, res) {
    const { email, password, token } = req.body;
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return res.render("passwordchange", { error: "User Not Found" });
      }

      const resetToken = user.resetToken;
      if (!resetToken || resetToken.token !== token) {
        return res.render("passwordreset", {
          error: "Restore Password Token Invalid",
        });
      }

      const now = new Date();
      if (now > resetToken.expire) {
        return res.render("passwordreset", {
          error: "Restore Password Token Expired",
        });
      }
      if (isValidPassword(password, user)) {
        return res.render("passwordchange", {
          error: "The new password cannot be the same as the previous one",
        });
      }

      user.password = createHash(password);
      user.resetToken = undefined;
      await userRepository.save(user);

      return res.redirect("/login");
    } catch (error) {
      return res
        .status(500)
        .render("passwordreset", { error: "Server Internal Error" });
    }
  }

  async changeRolePremium(req, res) {
    const { uid } = req.params;
    try {
      const user = await userRepository.findById(uid);
      if (!user) {
        return res.status(404).send("User Not Found");
      }

      const requiredDocumentation = [
        "Identification",
        "Proof of Address",
        "Proof of Account Status",
      ];

      const userDocuments = user.documents.map((doc) => doc.name);

      const hasDocumentation = requiredDocumentation.every((doc) =>
        userDocuments.includes(doc)
      );

      if (!hasDocumentation) {
        return res
          .status(400)
          .send("The user must complete all required documentation");
      }

      const newRole = user.role === "user" ? "premium" : "user";
      res.send(newRole);
    } catch (error) {
      res.status(500).send("Server Internal Error");
    }
  }
}

module.exports = UserController;
