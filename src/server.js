import express from "express";
import carRoutes from "./routes/carRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import viewRoutes from "./routes/viewRoutes.js";
import sequelize from "./config/database.js";
import path from "path";
import carModel from "./models/carModel.js";
import userModel from "./models/userModel.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import session from "express-session";
import flash from "connect-flash";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  await sequelize.authenticate();
  console.log("Database connection successfully!");
  await carModel.sync();
  await userModel.sync();
} catch (error) {}

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("public"));
app.use("/img", express.static(path.join(__dirname, "public/img")));
app.use("/upload", express.static(path.join(__dirname, "public/upload")));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));

app.set("view engine", "ejs");

app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use(carRoutes);
app.use(userRoutes);
app.use(viewRoutes);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server jalan di http://localhost:${port}`);
});
