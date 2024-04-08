const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database");

const Users = db.define(
  "Cupboard_Master",
  {
    Cupboard_Code: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    autoIncrement: true,
    },
    Cupboard_Name: {
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
