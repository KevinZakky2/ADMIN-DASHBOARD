import carModel from "../../models/carModel.js";

export const getCarsbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await carModel.findByPk(id);
    if(car){
      res.render('editcars', {car: car});
      // res.status(200).json({ status: true, message: "Success fetch car by id", data: car });
    }
    else{
      res.render('cars');
    }
  } catch (error) {
    res.redirect("/cars");
    // res.status(500).json({ status: false, message: error.message });
  }
};
