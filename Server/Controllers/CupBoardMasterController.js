const sequelize = require('../config/database');
const Users = require('../models/CupBoardMasterModels'); 
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const CupBoardMasterController = {
  
  // GET All Users From database
  getAllCupBoardmaster: async (req, res) => {
    try {
      const CupBoardMasters = await Users.findAll();
      res.json(CupBoardMasters);
    } catch (error) {
      console.error('Error fetching user creations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

    // GET Last Users User_Code From database
  getLastCupBoardMaster: async (req, res) => {
    try {
      const lastCupBoardMaster = await Users.max('Cupboard_Code');
      res.json({ lastCupBoardMaster });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // GET last Users All data From database
  getLastCupBoardMasterAll: async (req, res) => {
    try {
      const lastCupBoardMaster = await Users.findOne({
        order: [['Cupboard_Code', 'DESC']],
      });
  
      res.json({ lastCupBoardMaster });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  // Create a New User 
  createCupBoardMaster: async (req, res) => {
    let transaction;
    try {
      transaction = await sequelize.transaction();

      const {
        Cupboard_Name, 
      } = req.body;

      // Find the maximum employeeCode in the database within the transaction
      const maxEmployeeCode = await Users.max('Cupboard_Code', { transaction });

      // Calculate the new employeeCode
      const newCupboard_Code = maxEmployeeCode ? maxEmployeeCode + 1 : 1;

      // Create the user creation record within the transaction
      const CupBoardMaster = await Users.create(
        {
          Cupboard_Code: newCupboard_Code,
          Cupboard_Name,
          
        },
        { transaction }
      );

      // Commit the transaction if everything is successful
      await transaction.commit();

      return res.status(201).json({ message: 'User creation successful', CupBoardMaster });
    } catch (error) {
      // Rollback the transaction in case of an error
      if (transaction) {
        await transaction.rollback();
      }

      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

    // Update the User 
  updateCupBoardMaster: async (req, res) => {
      let transaction;
  
      try {
        transaction = await sequelize.transaction();
  
        const { Cupboard_Code } = req.params;
        const {
            Cupboard_Name, 
        } = req.body;
  
        // Check if the user with the given employeeCode exists
        const existingCupBoardMaster = await Users.findOne({
          where: { Cupboard_Code },
          transaction,
        });
  
        if (!existingCupBoardMaster) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        // Update the user creation record within the transaction
        await existingCupBoardMaster.update(
          {
            Cupboard_Name, 
          },
          { transaction }
        );
  
        // Commit the transaction if everything is successful
        await transaction.commit();
  
        return res.status(200).json({ message: 'User update successful', CupBoardMaster: existingCupBoardMaster });
      } catch (error) {
        // Rollback the transaction in case of an error
        if (transaction) {
          await transaction.rollback();
        }
  
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    },

    // Delete User From database
  deleteCupBoardMaster: async (req, res) => {
    let transaction;

    try {
      transaction = await sequelize.transaction();

      const { Cupboard_Code } = req.params;

      // Check if the user with the given employeeCode exists
      const existingCupBoardMaster = await Users.findOne({
        where: { Cupboard_Code },
        transaction,
      });

      if (!existingCupBoardMaster) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Delete the user creation record within the transaction
      await existingCupBoardMaster.destroy({ transaction });

      // Commit the transaction if everything is successful
      await transaction.commit();

      return res.status(200).json({ message: 'User deletion successful' });
    } catch (error) {
      // Rollback the transaction in case of an error
      if (transaction) {
        await transaction.rollback();
      }

      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },


  //Navigations API
  getFirstNavigation: async (req, res) => {
    try {
      const firstUserCreation = await Users.findOne({
        order: [['Cupboard_Code', 'ASC']],
      });

      res.json({ firstUserCreation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getLastNavigation: async (req, res) => {
    try {
      const lastUserCreation = await Users.findOne({
        order: [['Cupboard_Code', 'DESC']],
      });
  
      res.json({ lastUserCreation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getPreviousNavigation: async (req, res) => {
    try {
      const { currentEmployeeCode } = req.params;
  
      const previousUserCreation = await Users.findOne({
        where: {
          Cupboard_Code: {
            [Op.lt]: currentEmployeeCode,
          },
        },
        order: [['Cupboard_Code', 'DESC']],
      });
  
      res.json({ previousUserCreation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  getNextNavigation: async (req, res) => {
    try {
      const { currentEmployeeCode } = req.params;
  
      const nextUserCreation = await Users.findOne({
        where: {
          Cupboard_Code: {
            [Op.gt]: currentEmployeeCode,
          },
        },
        order: [['Cupboard_Code', 'ASC']],
      });
  
      res.json({ nextUserCreation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
 
  
};

module.exports = CupBoardMasterController;
