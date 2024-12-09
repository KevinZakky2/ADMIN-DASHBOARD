import { createCars } from "../controllers/carControllers/createCars";
import carModel from "../models/carModel";

jest.mock("../models/carModel");
jest.mock("express-flash");

describe("createCars Controller", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      body: {
        name: "Test Car",
        size: "Medium",
        rentPerDay: 100,
      },
      file: {
        filename: "test-car-image.jpg",
      },
      flash: jest.fn(),
    };

    mockRes = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("should successfully create a new car", async () => {
    const mockNewCar = {
      save: jest.fn().mockResolvedValue(true),
    };
    carModel.create.mockResolvedValue(mockNewCar);

    await createCars(mockReq, mockRes);

    // Assertions
    expect(carModel.create).toHaveBeenCalledWith({
      name: "Test Car",
      size: "Medium",
      rentPerDay: 100,
      image: "test-car-image.jpg",
    });

    expect(mockNewCar.save).toHaveBeenCalled();
    expect(mockReq.flash).toHaveBeenCalledWith(
      "success",
      "Cars successfully create"
    );
    expect(mockRes.redirect).toHaveBeenCalledWith("/cars");
  });

  test("should handle errors when car creation fails", async () => {
    const mockError = new Error("Creation failed");
    carModel.create.mockRejectedValue(mockError);

    await createCars(mockReq, mockRes);

    // Assertions
    expect(mockReq.flash).toHaveBeenCalledWith("error", "Cars create failed");
    expect(mockRes.redirect).toHaveBeenCalledWith("createcars");
  });
});
