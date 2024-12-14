import userModel from "../../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { AccessDeniedError } from "sequelize";

dotenv.config();

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ where: { email: email } });
    if (user == null) {
      // return res.status(404).json({ message: "User not found" });
      req.flash("error", "User hasn't been registered");
      return res.redirect("/");
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      // return res.status(401).json({ message: "Wrong password" });
      req.flash("error", "Password is incorrect");
      return res.redirect("/");
    }

    const acesstoken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "1d",
      }
    );

    console.log(`access token : ${acesstoken}`);

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "1d",
      }
    );

    console.log(`refresh token : ${refreshToken}`);
    const loginUser = await userModel.update(
      { refreshToken: refreshToken },
      { where: { id: user.id } }
    );

    if (loginUser) {
      req.session.refreshToken = refreshToken;
      req.flash("success", "Login Successful!");
      res.redirect("/cars");
    }
  } catch (error) {
    req.flash("error", error.message);
    return res.render("/");
    // return res.status(500).json({ status: false, message: error.message });
  }
};
