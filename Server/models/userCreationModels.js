const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database");

const Users = db.define(
  "User_Creation",
  {
    User_Code: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    autoIncrement: true,
    },
    User_Name: {
      type: DataTypes.STRING,
    },
    Mobile_No: {
      type: DataTypes.INTEGER,
    },
    Email: {
      type: DataTypes.STRING,
    },
    Password: {
      type: DataTypes.STRING,
    },
    User_Type: {
      type: DataTypes.STRING,
    },
  },

  {
    freezeTableName: true,
    timestamps: false,
  }
);
//Users.removeAttribute("id"), 

(module.exports = Users);
