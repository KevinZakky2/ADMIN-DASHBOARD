import carModel from "../models/carModel.js";
import fs from "fs";
import path from "path";
import { editCar } from "../controllers/carControllers/editCars.js";

jest.mock("../models/carModel.js");
jest.mock("fs");
jest.mock("path");

jest.mock("../utils/dirname.js", () => {
  return {
    default: "/mock/directory",
  };
});

describe("editCar controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 1 },
      body: {
        name: "Updated Car",
        size: "Medium",
        rentPerDay: 1000,
        status: "Available",
      },
      file: { filename: "newImage.jpg" },
      flash: jest.fn(),
    };
    res = {
      redirect: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update car details and redirect to /cars", async () => {
    const mockCar = { id: 1, name: "Old Car", image: "oldImage.jpg" };
    carModel.findByPk.mockResolvedValue(mockCar);
    carModel.update.mockResolvedValue([1]);

    const mockPath = "/mock/upload/path";
    path.join.mockReturnValue(mockPath);
    fs.unlink.mockImplementation((filePath, callback) => callback(null));

    await editCar(req, res);

    expect(carModel.findByPk).toHaveBeenCalledWith(req.params.id);
    expect(carModel.update).toHaveBeenCalledWith(
      {
        name: req.body.name,
        size: req.body.size,
        rentPerDay: req.body.rentPerDay,
        status: req.body.status,
        image: req.file.filename,
      },
      { where: { id: req.params.id } }
    );
    expect(fs.unlink).toHaveBeenCalledWith(mockPath, expect.any(Function));
    expect(req.flash).toHaveBeenCalledWith(
      "success",
      "Car updated successfully"
    );
    expect(res.redirect).toHaveBeenCalledWith("/cars");
  });

  it("should handle file unlink error gracefully", async () => {
    const mockCar = { id: 1, name: "Old Car", image: "oldImage.jpg" };
    carModel.findByPk.mockResolvedValue(mockCar);
    carModel.update.mockResolvedValue([1]);

    const mockPath = "/mock/upload/path";
    path.join.mockReturnValue(mockPath);
    fs.unlink.mockImplementation((filePath, callback) =>
      callback(new Error("Failed to delete image"))
    );

    await editCar(req, res);

    expect(fs.unlink).toHaveBeenCalledWith(mockPath, expect.any(Function));
    expect(req.flash).toHaveBeenCalledWith(
      "success",
      "Car updated successfully"
    );
    expect(res.redirect).toHaveBeenCalledWith("/cars");
  });
});
