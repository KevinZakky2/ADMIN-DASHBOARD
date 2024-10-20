import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const carModel = sequelize.define(
  "Cars",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rentPerDay: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Available",
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    startRent: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    finishRent: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "cars",
  }
);

export default carModel;

(async () => {
  await sequelize.sync();
})();
