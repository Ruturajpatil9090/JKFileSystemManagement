import React, { useState, useEffect } from "react";
import { Form, Button, Navbar, Nav } from "react-bootstrap";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { RiLoginBoxLine } from "react-icons/ri";
import logo from "../../../Assets/fileimage.jpg";
import logo1 from "../../../Assets/filesearch.jpg";
import logo2 from "../../../Assets/Employee1.png";
import dblogo from "../../../Assets/db3.png";
import cupboard from "../../../Assets/cupboard.png"

const Home = () => {
  const [User_Type, setUserType] = useState("");
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const fetchedUserType = decodedToken.User_Type || "U";

      setUserType(fetchedUserType);
    } else {
      navigate("/");
    }
  }, []);

  const handleCupBoardClick = () => {
    navigate("/employeemasterutility");
  };

  const handleFileInfo = () => {
    navigate("/File_Info_Utility");
  };

  const handleUserClick = () => {
    navigate("/user_Creation_utility");
  };

  const handleSearchFile = ()=>{
    navigate("/search_file");
  }

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const handleBackup = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/backup", {
        method: "POST",
      });

      const data = await response.json();
      window.alert("Backup restore Successfully..");
    } catch (error) {
      console.error("Error during backup:", error.message);
    }
  };

  return (

    <div className="centered">
      {token && (
        <Navbar bg="info" expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end container "
          >
            <RiLoginBoxLine style={{ fontSize: "25px" }} />
            <Navbar.Brand>{userName}</Navbar.Brand>
            <Nav>
              <Button variant="danger" onClick={handleLogoutClick}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )}
      <br></br>

      <Form.Label className="animate-charcter">Jk Commodity</Form.Label>
      <br></br>
      <div className="button-container">
        {User_Type === "A" && (
          <Button
            variant="primary"
            className="button "
            onClick={handleCupBoardClick}
            style={{ color: "black", fontWeight: "bold" }}
          >
            <img
              src={cupboard}
              alt=""
              style={{ height: "70px", width: "70px", borderRadius: "25%" }}
            />
            CupBoard Master
          </Button>
        )}

        <Button
          variant="success"
          className="button"
          onClick={handleFileInfo}
          style={{ color: "black", fontWeight: "bold" }}
        >
          <img
            src={logo}
            alt=""
            style={{ height: "70px", width: "70px", borderRadius: "50%" }}
          />
          File Information
        </Button>


        <Button
            variant="secondary"
            className="button"
            onClick={handleSearchFile}
            style={{ color: "black", fontWeight: "bold" }}
          >
            <img src={logo1} alt="" style={{ height: "70px", width: "70px",borderRadius: "50%" }} />
            Search File
          </Button>
        

        {User_Type === "A" && (
          <Button
            variant="info"
            className="button"
            onClick={handleUserClick}
            style={{ color: "black", fontWeight: "bold" }}
          >
            <img src={logo2} alt="" style={{ height: "70px", width: "70px" }} />
            User Creation
          </Button>
        )}

        <Button
          variant="warning"
          className="button"
          onClick={handleBackup}
          style={{ color: "black", fontWeight: "bold" }}
        >
          <img
            src={dblogo}
            alt=""
            style={{ height: "70px", width: "70px", borderRadius: "50%" }}
          />
          Backup
        </Button>
      </div>
    </div>
  );
};

export default Home;