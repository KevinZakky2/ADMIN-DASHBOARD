import carModel from "../models/carModel.js";
import fs from "fs";
import path from "path";
import __dirname from "../utils/dirname.js";
import { deleteCars } from "../controllers/carControllers/deleteCars.js";

// Mock dependencies
jest.mock("../models/carModel.js");
jest.mock("fs");
jest.mock("path");
jest.mock("../utils/dirname.js", () => "/mock/directory");

describe("deleteCars controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 1 },
      flash: jest.fn(),
    };
    res = {
      redirect: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should delete the car and its image, then redirect to /cars", async () => {
    const mockCar = {
      id: 1,
      image: "carImage.jpg",
      destroy: jest.fn().mockResolvedValue(true),
    };
    carModel.findByPk.mockResolvedValue(mockCar);
    path.join.mockReturnValue("/mock/directory/public/upload/carImage.jpg");
    fs.unlink.mockImplementation((filePath, callback) => callback(null));

    await deleteCars(req, res);

    // Ensure car is fetched
    expect(carModel.findByPk).toHaveBeenCalledWith(req.params.id);

    // Ensure the correct image path is constructed
    expect(path.join).toHaveBeenCalledWith(
      "/mock/directory",
      "../public/upload",
      mockCar.image
    );

    // Ensure fs.unlink is called with the correct path
    expect(fs.unlink).toHaveBeenCalledWith(
      "/mock/directory/public/upload/carImage.jpg",
      expect.any(Function)
    );

    // Ensure car.destroy is called
    expect(mockCar.destroy).toHaveBeenCalled();

    // Ensure success flash message is set
    expect(req.flash).toHaveBeenCalledWith(
      "success",
      "Car deleted successfully"
    );

    // Ensure redirection to /cars
    expect(res.redirect).toHaveBeenCalledWith("/cars");
  });

  it("should handle error when car.destroy fails", async () => {
    const mockCar = {
      id: 1,
      image: "carImage.jpg",
      destroy: jest.fn().mockRejectedValue(new Error("Destroy failed")),
    };
    carModel.findByPk.mockResolvedValue(mockCar);
    path.join.mockReturnValue("/mock/directory/public/upload/carImage.jpg");
    fs.unlink.mockImplementation((filePath, callback) => callback(null));

    await deleteCars(req, res);

    // Ensure car.destroy is called
    expect(mockCar.destroy).toHaveBeenCalled();

    // Ensure error flash message is set
    expect(req.flash).toHaveBeenCalledWith("error", "Car deleted failed");

    // Ensure redirection to /cars
    expect(res.redirect).toHaveBeenCalledWith("/cars");
  });
});
