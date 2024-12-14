import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: "mysql",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: "mysql",
//     charset: "utf8mb4",
//     collation: "utf8mb4_unicode_ci",
//     dialectOptions: {
//       charset: "utf8mb4",
//       supportBigNumbers: true,
//       bigNumberStrings: true,
//     },
//   }
// );

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connection to database has been established successfully.");
//   })
//   .catch((err) => {
//     console.error("Unable to connect to the database:", err);
//   });

export default sequelize;
