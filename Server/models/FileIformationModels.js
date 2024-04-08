const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database");

const Users = db.define(
  "File_Info",
  {
    Doc_No: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    
    },
    Doc_Date: {
      type: DataTypes.DATE,
    },
    File_Name: {
      type: DataTypes.STRING,
    },
    File_Discription: {
      type: DataTypes.STRING,
    },
    Cupboard_Code: {
      type: DataTypes.INTEGER,
    },
    File_No: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    CupBoardCode_Name :{
      type: DataTypes.STRING,
    }
  },

  {
    freezeTableName: true,
    timestamps: false,
  }
);
//Users.removeAttribute("id"), 

(module.exports = Users);
