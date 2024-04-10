const express = require('express');
const UserCreation = require('../Controllers/userCreationController');
const CupboardMaster = require('../Controllers/CupBoardMasterController');
const FileCreation = require("../Controllers/FileInformationController")


const router = express.Router();

//user creation routes 
router.get('/getallusers', UserCreation.getAllUserCreations);
router.get('/lastusercode', UserCreation.getLastUserCreation);
router.get('/getlastrecordbyuserid', UserCreation.getLastUserCreationAll);
router.post('/insertnewuser', UserCreation.createUserCreation);
router.put('/updateuser/:User_Code', UserCreation.updateUserCreation);
router.delete('/deleteuser/:User_Code', UserCreation.deleteUserCreation);

router.get('/getfirstnavigation', UserCreation.getFirstNavigation);
router.get('/getlastnavigation', UserCreation.getLastNavigation);
router.get('/getpreviousnavigation/:currentEmployeeCode', UserCreation.getPreviousNavigation);
router.get('/getnextnavigation/:currentEmployeeCode', UserCreation.getNextNavigation);


//CupBoard Master API 
router.get('/getallCupBoard', CupboardMaster.getAllCupBoardmaster);
router.get('/lastCupBoardCode', CupboardMaster.getLastCupBoardMaster);
router.get('/getlastrecordcupboardmaster', CupboardMaster.getLastCupBoardMasterAll);
router.post('/insertFilemaster', CupboardMaster.createCupBoardMaster);
router.put('/updatecupboardmaster/:Cupboard_Code', CupboardMaster.updateCupBoardMaster);
router.delete('/deletcupboardmaster/:Cupboard_Code', CupboardMaster.deleteCupBoardMaster);

router.get('/getfirstnavigationcupboard', CupboardMaster.getFirstNavigation);
router.get('/getlastnavigationcupboard', CupboardMaster.getLastNavigation);
router.get('/getpreviousnavigationcupboard/:currentEmployeeCode', CupboardMaster.getPreviousNavigation);
router.get('/getnextnavigationcupboard/:currentEmployeeCode', CupboardMaster.getNextNavigation);


//File creation routes 
router.get('/getallFiles', FileCreation.getAllFileCreation);
router.get('/getLastCupboardCode/:Cupboard_Code', FileCreation.getLastCupboardCode);
router.get('/lastFileCode', FileCreation.getLastFileCreationCode);
router.get('/getlastfilebyid', FileCreation.getLastFileCreation);
router.post('/insertfile', FileCreation.createFileInformation);
router.put('/updatefile/:Doc_No', FileCreation.updateFileInformation);
router.delete('/deletefile/:Doc_No', FileCreation.deleteFile);
router.get('/getdatabyDocNo/:Doc_No', FileCreation.getFileCreationByDocNo);

router.get('/getfirstnavigationfile', FileCreation.getFirstNavigation);
router.get('/getlastnavigationfile', FileCreation.getLastNavigation);
router.get('/getpreviousnavigationfile/:currentEmployeeCode', FileCreation.getPreviousNavigation);
router.get('/getnextnavigationfile/:currentEmployeeCode', FileCreation.getNextNavigation);

//Login API
router.post('/loginuser', UserCreation.LoginUser);
router.get('/getfirstnavigation', UserCreation.getFirstNavigation);
router.get('/getlastnavigation', UserCreation.getLastNavigation);
router.get('/getpreviousnavigation/:currentEmployeeCode', UserCreation.getPreviousNavigation);
router.get('/getnextnavigation/:currentEmployeeCode', UserCreation.getNextNavigation);

module.exports = router;
