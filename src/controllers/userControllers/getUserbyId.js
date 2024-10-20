import userModel from "../../models/userModel.js";

export const getUserbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByPk(id);
    return res.status(200).json({
      status: false,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
