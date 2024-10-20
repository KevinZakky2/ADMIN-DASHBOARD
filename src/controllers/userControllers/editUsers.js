import userModel from "../../models/userModel.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import __dirname from "../../utils/dirname.js";

export const editUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const image = req.file ? req.file.filename : "";
    const check = await userModel.findByPk(id);

    if (!check) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    const { fullName, email, password, role = check.role, photoProfile = check.photoProfile } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
  
    if (photoProfile != null) {
      const imagePath = path.join( __dirname, "../public/upload",check.profilePicture);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        }
      });
    }

    await userModel.update(
      {
        fullName: fullName,
        email: email,
        password: hashPassword,
        role: role,
        profilePicture: image ? image : check.profilePicture,
      },
      { where: { id } }
    );
    return res.status(200).json({
      status: true,
      message: "Users updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
