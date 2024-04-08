const sequelize = require('../config/database');
const UserCreation = require('../models/FileIformationModels'); 
const { Op } = require('sequelize');

const userCreationController = {
  
  // GET All Users From database
  getAllFileCreation: async (req, res) => {
    try {
      const userCreations = await UserCreation.findAll();
      res.json(userCreations);
    } catch (error) {
      console.error('Error fetching user creations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

    // GET Last Users User_Code From database
    getLastFileCreationCode: async (req, res) => {
    try {
      const lastUserCreation = await UserCreation.max('Doc_No');
      res.json({ lastUserCreation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getLastCupboardCode: async (req, res) => {
    const { Cupboard_Code } = req.params;

    try {
        const maxFileNo = await UserCreation.max('File_No', {
            where: { Cupboard_Code: Cupboard_Code }
        });

        res.json({ maxFileNo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
  },

  // GET last Users All data From database
  getLastFileCreation: async (req, res) => {
    try {
      const lastUserCreation = await UserCreation.findOne({
        order: [['Doc_No', 'DESC']],
      });
  
      res.json({ lastUserCreation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  // Create a New User 
  createFileInformation: async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();

        const {
            Doc_No,
            Doc_Date,
            File_Name,
            File_Discription,
            Cupboard_Code,
            File_No,
            CupBoardCode_Name
        } = req.body;

        // Find the maximum Doc_No and File_No for the given Cupboard_Code in the database within the transaction
        const maxDocNo = await UserCreation.max('Doc_No', { transaction });
        const maxFileNo = await UserCreation.max('File_No', {
            where: { Cupboard_Code },
            transaction
        });

        // Calculate the new Doc_No and File_No
        const newDocNo = maxDocNo ? maxDocNo + 1 : 1;
        const newFileNo = maxFileNo ? maxFileNo + 1 : 1;

        // Create the user creation record within the transaction
        const userCreation = await UserCreation.create(
            {
                File_No: newFileNo,
                Doc_No: newDocNo,
                Doc_Date,
                File_Name,
                File_Discription,
                Cupboard_Code,
                CupBoardCode_Name
            },
            { transaction }
        );

        // Commit the transaction if everything is successful
        await transaction.commit();

        return res.status(201).json({ message: 'User creation successful', userCreation });
    } catch (error) {
        // Rollback the transaction in case of an error
        if (transaction) {
            await transaction.rollback();
        }

        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
},



updateFileInformation: async (req, res) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();

    const { Doc_No } = req.params;
    const {
      File_Name,
      File_Description,
      Cupboard_Code,
    } = req.body;

    // Check if the file information with the given Doc_No exists
    const existingFileInformation = await UserCreation.findOne({
      where: { Doc_No },
      transaction,
    });

    if (!existingFileInformation) {
      return res.status(404).json({ error: 'File information not found' });
    }

    // Check the max File_No for the given Cupboard_Code
    const maxFileNo = await UserCreation.max('File_No', {
      where: { Cupboard_Code },
      transaction,
    });

    // Calculate the new File_No
    const newFileNo = maxFileNo ? maxFileNo + 1 : 1;
    console.log("new file no",newFileNo)

    // Update the file information record within the transaction
    await existingFileInformation.update(
      {
      
        File_Name,
        File_Description,
        Cupboard_Code,
        File_No: newFileNo,
       
      },
      { transaction }
    );

    // Commit the transaction if everything is successful
    await transaction.commit();

    return res.status(200).json({ message: 'File information update successful', fileInformation: existingFileInformation });
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
    deleteFile: async (req, res) => {
    let transaction;

    try {
      transaction = await sequelize.transaction();

      const { Doc_No } = req.params;

      // Check if the user with the given employeeCode exists
      const existingUserCreation = await UserCreation.findOne({
        where: { Doc_No },
        transaction,
      });

      if (!existingUserCreation) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Delete the user creation record within the transaction
      await existingUserCreation.destroy({ transaction });

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


  getFirstNavigation: async (req, res) => {
    try {
      const firstUserCreation = await UserCreation.findOne({
        order: [['Doc_No', 'ASC']],
      });

      res.json({ firstUserCreation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getLastNavigation: async (req, res) => {
    try {
      const lastUserCreation = await UserCreation.findOne({
        order: [['Doc_No', 'DESC']],
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
  
      const previousUserCreation = await UserCreation.findOne({
        where: {
          Doc_No: {
            [Op.lt]: currentEmployeeCode,
          },
        },
        order: [['Doc_No', 'DESC']],
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
  
      const nextUserCreation = await UserCreation.findOne({
        where: {
          Doc_No: {
            [Op.gt]: currentEmployeeCode,
          },
        },
        order: [['Doc_No', 'ASC']],
      });
  
      res.json({ nextUserCreation });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  


};

module.exports = userCreationController;
