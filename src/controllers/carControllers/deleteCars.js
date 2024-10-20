import carModel from "../../models/carModel.js";
import fs from "fs";
import path from "path";
import __dirname from "../../utils/dirname.js";

export const deleteCars = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await carModel.findByPk(id);

    if (!car) {
      req.flash('error', 'Car not found');
      res.redirect('/cars');
      // return res.status(404).json({ status: false, message: "Car not found" });
    }

    const imagePath = path.join( __dirname, "../public/upload",car.image);
    if (imagePath) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        }
      });
    }

    const carDelete = await car.destroy(id);
    if(carDelete){
      req.flash("success", "Car deleted successfully");
      res.redirect("/cars" );

      // return res.status(200).json({ status: true, message: "Car deleted successfully" });
    }
  } catch (error) {
    req.flash("error", "Car deleted failed");
    res.redirect("/cars");
    // return res.status(500).json({ status: false, message: error.message });
  }
};
