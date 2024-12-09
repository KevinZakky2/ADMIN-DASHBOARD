import { loginUser } from "../controllers/userControllers/loginUser.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock dependencies
jest.mock("../models/userModel.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Login Controller", () => {
  let mockReq, mockRes, mockFlash, mockSession;

  beforeEach(() => {
    mockFlash = jest.fn();
    mockSession = {};
    mockReq = {
      body: {
        email: "admin1@gmail.com",
        password: "admin1",
      },
      flash: mockFlash,
      session: mockSession,
    };
    mockRes = {
      redirect: jest.fn(),
      render: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("User login sucessfuly", async () => {
    // Mock user found
    const mockUser = {
      id: 1,
      email: "admin1@gmail.com",
      password: "hashedPassword", 
    };
    userModel.findOne.mockResolvedValue(mockUser);

    bcrypt.compare.mockResolvedValue(true);

    jwt.sign
      .mockReturnValueOnce("accessToken")
      .mockReturnValueOnce("refreshToken");

    userModel.update.mockResolvedValue([1]);
    await loginUser(mockReq, mockRes);

    // Assertions
    expect(userModel.findOne).toHaveBeenCalledWith({
      where: { email: "admin1@gmail.com" },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith("admin1", "hashedPassword");
    expect(userModel.update).toHaveBeenCalledWith(
      { refreshToken: "refreshToken" },
      { where: { id: 1 } }
    );
    expect(mockFlash).toHaveBeenCalledWith("success", "Login Successful!");
    expect(mockRes.redirect).toHaveBeenCalledWith("/cars");
    expect(mockSession.refreshToken).toBe("refreshToken");
  });

  test("Failed login - User not found", async () => {
    userModel.findOne.mockResolvedValue(null);

    await loginUser(mockReq, mockRes);

    // Assertions
    expect(userModel.findOne).toHaveBeenCalledWith({
      where: { email: "admin1@gmail.com" },
    });
    expect(mockFlash).toHaveBeenCalledWith(
      "error",
      "User hasn't been registered"
    );
    expect(mockRes.redirect).toHaveBeenCalledWith("/");
  });

  test(" login - Incorrect password", async () => {
    const mockUser = {
      id: 1,
      email: "admin1@gmail.com",
      password: "hashedPassword",
    };
    userModel.findOne.mockResolvedValue(mockUser);

    bcrypt.compare.mockResolvedValue(false);
    await loginUser(mockReq, mockRes);

    // Assertions
    expect(userModel.findOne).toHaveBeenCalledWith({
      where: { email: "admin1@gmail.com" },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith("admin1", "hashedPassword");
    expect(mockFlash).toHaveBeenCalledWith("error", "Password is incorrect");
    expect(mockRes.redirect).toHaveBeenCalledWith("/");
  });
});
