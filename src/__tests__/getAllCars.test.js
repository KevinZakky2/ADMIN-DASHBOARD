import { getAllCars } from "../controllers/carControllers/getAllCars.js";
import carModel from "../models/carModel.js";

jest.mock("../models/carModel.js");

describe("getAllCars Controller", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      render: jest.fn(),
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should render cars view with all cars when cars exist", async () => {
    const mockCars = [
      { id: 1, name: "Car 1" },
      { id: 2, name: "Car 2" },
    ];
    carModel.findAll.mockResolvedValue(mockCars);

    await getAllCars(mockReq, mockRes);

    expect(carModel.findAll).toHaveBeenCalled();
    expect(mockRes.render).toHaveBeenCalledWith("cars", { cars: mockCars });
  });

  it("should render cars view without data when no cars found", async () => {
    carModel.findAll.mockResolvedValue([]);

    await getAllCars(mockReq, mockRes);

    expect(mockRes.render).toHaveBeenCalledWith("cars", { cars: [] });
  });
});
