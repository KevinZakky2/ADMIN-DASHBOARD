import carModel from "../../models/carModel.js";
import fs from "fs";
import path from "path";
import __dirname from "../../utils/dirname.js";

export const editCar = async (req, res) => {
  try {
    const { id } = req.params;

    const check = await carModel.findByPk(id);
    const { name, size, rentPerDay, status = check.status, image } = req.body;

    if (req.file) {
      const imagePath = path.join(__dirname, "../public/upload", check.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        }
      });
    }

    const updateCars = await carModel.update(
      { name, size, rentPerDay, status, image: req.file.filename },
      { where: { id } }
    );

    if (updateCars) {
      req.flash("success", "Car updated successfully");
      res.redirect("/cars");
      // return res.status(200).json({ status: true, message: "Car updated successfully" });
    }
  } catch (error) {
    req.flash("error", "Car updated failed");
    res.redirect("/cars");
    // return res.status(500).json({ status: false, message: error.message });
  }
};
