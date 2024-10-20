import carModel from "../../models/carModel.js";

export const getAllCars = async (req, res) => {
    try {
      const cars = await carModel.findAll();
      if (cars) {
        res.render("cars", { cars: cars });
        // return res.status(200).json({ status: true, message: "Success fetch all cars", data: cars });
      } else {
        res.render("cars");
      }
    } catch (error) {
      console.log(error.message);
      res.redirect("/cars");
      // return res.status(500).json({ status: false, message: error.message });
    }
};
