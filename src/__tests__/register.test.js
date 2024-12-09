import { Register } from "../controllers/userControllers/register.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

jest.mock("../models/userModel.js");
jest.mock("bcrypt");

describe("Register Controller", () => {
  let mockReq, mockRes, mockFlash;

  beforeEach(() => {
    mockFlash = jest.fn();
    mockReq = {
      body: {
        fullName: "admin1",
        email: "admin1@gmail.com",
        password: "admin1",
        confPassword: "admin1",
      },
      flash: mockFlash,
    };
    mockRes = {
      redirect: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("Successfully registers a new user", async () => {
    userModel.findOne.mockResolvedValue(null);
    bcrypt.genSalt.mockResolvedValue("mockSalt");
    bcrypt.hash.mockResolvedValue("hashedPassword");

    userModel.create.mockResolvedValue({});

    await Register(mockReq, mockRes);

    // Assertions
    expect(userModel.findOne).toHaveBeenCalledWith({
      where: { email: "admin1@gmail.com" },
    });
    expect(bcrypt.genSalt).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith("admin1", "mockSalt");
    expect(userModel.create).toHaveBeenCalledWith({
      fullName: "admin1",
      email: "admin1@gmail.com",
      password: "hashedPassword",
    });
    expect(mockFlash).toHaveBeenCalledWith(
      "success",
      "Registration successful!"
    );
    expect(mockRes.redirect).toHaveBeenCalledWith("/");
  });

  test("Fails registration when passwords and confirm password do not match", async () => {
    mockReq.body.confPassword = "koktanyasaya";

    await Register(mockReq, mockRes);

    // Assertions
    expect(mockFlash).toHaveBeenCalledWith(
      "error",
      "Password and confirm password doesn't match"
    );
    expect(mockRes.redirect).toHaveBeenCalledWith("/register");
    expect(userModel.create).not.toHaveBeenCalled();
  });
});
