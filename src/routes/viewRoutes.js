import express from "express";

const viewRoutes = express.Router();

viewRoutes.get("/", async (req, res) => {
  res.render("login");
});
viewRoutes.get("/register", async (req, res) => {
  res.render("register");
});
viewRoutes.get("/cars", async (req, res) => {
  res.render("cars");
});
viewRoutes.get("/createcars", async (req, res) => {
  res.render("createcars");
});
viewRoutes.get("/editcars", async (req, res) => {
  res.render("editcars");
});
export default viewRoutes;
