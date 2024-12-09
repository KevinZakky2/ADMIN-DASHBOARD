import userModel from "../../models/userModel.js";
import bcrypt from "bcrypt";

export const Register = async (req, res) => {
  const { fullName, email, password, confPassword } = req.body;

  const emailExisted = await userModel.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (emailExisted) {
    req.flash("error", "Email existed!");
    return res.redirect("/register");
  }

  if (password.length < 6) {
    req.flash("error", "Password must have 6 character minimum!");
    return res.redirect("/register");
  }

  if (password !== confPassword) {
    req.flash("error", "Password and confirm password doesn't match");
    return res.redirect("/register");
  }

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  await userModel.create({
    fullName: fullName,
    email: email,
    password: hashPassword,
  });
  req.flash("success", "Registration successful!");
  return res.redirect("/");
};
