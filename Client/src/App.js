import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Pages/Login/Login';
import Home from './Components/Pages/Home/Home';
import EmployeeMasterCompoenet from './Components/CupBoardMaster/CupBoardmasterComponent';
import UserCreationCompoenent from './Components/UserCreation/UserCreationCompoenent';
import EmployeeMasterUtility from "./Components/CupBoardMaster/CupBoardMasterUtility"
import UserCreationUtility from "./Components/UserCreation/UserCreationUtility"
import Footer from "./Components/Pages/Footer/Footer";
import FileInfoUtility from "./Components/File Info/FileInformationUtility"
import FileInfoComponent from "./Components/File Info/FileInformationComponent"
import SearchFile from "./Components/SearchFile/SearchFileUtility"

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
        <Route path="/"  element={<Login/>} /> 
          <Route path="/home" element={<Home/>} />
          <Route path="/employeemaster"  element={<EmployeeMasterCompoenet/>} /> 
          <Route path="/employeemasterutility"  element={<EmployeeMasterUtility/>} /> 
          <Route path="/user_Creation"  element={<UserCreationCompoenent/>} /> 
          <Route path="/user_Creation_utility"  element={<UserCreationUtility/>} /> 
          <Route path="/File_Info_Utility"  element={<FileInfoUtility/>} /> 
          <Route path="/File_Information"  element={<FileInfoComponent/>} /> 
          <Route path="/search_file"  element={<SearchFile/>} /> 
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
};

export default App;