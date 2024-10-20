import userModel from "../../models/userModel.js";
import fs from "fs";
import path from "path";
import __dirname from "../../utils/dirname.js";

export const deleteUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByPk(id);

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    const imagePath = path.join( __dirname, "../public/upload",user.profilePicture);
    if (imagePath) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        }
      });
    }
    await user.destroy(id);
    return res.status(200).json({
      status: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
