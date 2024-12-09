import carModel from "../../models/carModel.js";

export const createCars = async (req, res) => {
  try {
    const { name, size, rentPerDay } = req.body;

    const image = req.file.filename;
    const newCars = await carModel.create({
      name,
      size,
      rentPerDay,
      image,
    });
    if (newCars) {
      await newCars.save();
      console.log("Data saved..");
    }
    req.flash("success", "Cars successfully create");
    res.redirect("/cars");
    // return res.status(201).json({ status: true, message: "Cars successfully create" });
  } catch (error) {
    req.flash("error", "Cars create failed");
    res.redirect("createcars");
    // return res.status(500).json({ status: false, message: error.message });
  }
};
