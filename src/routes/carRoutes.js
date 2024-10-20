import express from "express";
import { createCars } from "../controllers/carControllers/createCars.js";
import { getAllCars } from "../controllers/carControllers/getAllCars.js";
import { getCarsbyId } from "../controllers/carControllers/getCarsbyId.js";
import { editCar } from "../controllers/carControllers/editCars.js";
import { deleteCars } from "../controllers/carControllers/deleteCars.js";
import upload from "../middlewares/upload.js";
import { authCheck } from "../middlewares/authCheck.js";

const carRoutes = express.Router();

// carRoutes.post("/cars", upload.single("image"), authCheck, createCars);
// carRoutes.get("/cars", authCheck, getAllCars);
// carRoutes.get("/cars/:id", authCheck, getCarsbyId);
// carRoutes.put("/cars/:id", upload.single("image"), authCheck, editCar);
// carRoutes.delete("/cars/:id", authCheck, deleteCars);

carRoutes.post("/cars", upload.single("image"), authCheck, createCars);
carRoutes.get("/cars", authCheck, getAllCars);
carRoutes.get("/cars/:id", authCheck, getCarsbyId);
carRoutes.post("/cars/:id", upload.single("image"), authCheck, editCar);
carRoutes.get("/cars/edit/:id", authCheck, editCar);
carRoutes.get("/cars/delete/:id", authCheck, deleteCars);

export default carRoutes;
