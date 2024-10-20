import userModel from "../../models/userModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.findAll();

    return res.status(200).json({
      status: false,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
