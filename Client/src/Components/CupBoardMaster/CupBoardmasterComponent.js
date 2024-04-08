import React, { useState, useEffect, useRef } from "react";
import "../../App.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const lastemployeeCode = ""
const EmployeeMasterComponent = () => {
  // console.log("from time values", From_Time, To_Time);
  const apiURL = process.env.REACT_APP_API_URL;

  const addNewButtonRef = useRef(null);
  const resaleMillDropdownRef = useRef(null);

  const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
  const [saveButtonClicked, setSaveButtonClicked] = useState(false);
  const [addOneButtonEnabled, setAddOneButtonEnabled] = useState(false);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(true);
  const [cancelButtonEnabled, setCancelButtonEnabled] = useState(true);
  const [editButtonEnabled, setEditButtonEnabled] = useState(false);
  const [deleteButtonEnabled, setDeleteButtonEnabled] = useState(false);
  const [backButtonEnabled, setBackButtonEnabled] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [highlightedButton, setHighlightedButton] = useState(null);
  const [cancelButtonClicked, setCancelButtonClicked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [employeeDetails, setEmployeeDetails] = useState({
    Cupboard_Code: "",
    Cupboard_Name: "",
  
  });

  const navigate = useNavigate();

  const handleAddOne = () => {
    // Disable and enable buttons as needed
    setAddOneButtonEnabled(false);
    setSaveButtonEnabled(true);
    setCancelButtonEnabled(true);
    setEditButtonEnabled(false);
    setDeleteButtonEnabled(false);
    setIsEditMode(false);
    setIsEditing(true);

    // Focus on the dropdown if it exists
    if (resaleMillDropdownRef.current) {
      resaleMillDropdownRef.current.focus();
    }

    // Fetch the last employee code from the API
    axios
      .get(`${apiURL}/api/employees/lastCupBoardCode`)
      .then((response) => {
        // Assuming the API response contains the last employee code
        const lastEmployeeCode = response.data.lastCupBoardMaster;
        // Set the last employee code to the employeeDetails
        setEmployeeDetails((prevState) => ({
          ...prevState,
          Cupboard_Code: lastEmployeeCode + 1,
          Cupboard_Name: "",
          
        }));
      })
      .catch((error) => {
        console.error("Error fetching last employee code:", error);
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsEditMode(true);
    setAddOneButtonEnabled(false);
    setSaveButtonEnabled(true);
    setCancelButtonEnabled(true);
    setEditButtonEnabled(false);
    setDeleteButtonEnabled(false);
    setBackButtonEnabled(true);
    if (resaleMillDropdownRef.current) {
      resaleMillDropdownRef.current.focus();
    }
   
  };

  const handleSaveOrUpdate = () => {
    if (isEditMode) {
      // Create a new object with the date part
      const employeeToUpdate = {
        ...employeeDetails,
     
      };

      // Send the employee details to the backend API for update
      axios
        .put(
          `${apiURL}/api/employees/updatecupboardmaster/${employeeDetails.Cupboard_Code}`,
          employeeToUpdate
        )
        .then((response) => {
          // console.log("Employee updated:", response.data);
          // Optionally, reset the form or perform other actions after a successful update
          setIsEditMode(false);
          setAddOneButtonEnabled(true);
          setEditButtonEnabled(true);
          setDeleteButtonEnabled(true);
          setBackButtonEnabled(true);
          setSaveButtonEnabled(false);
          setCancelButtonEnabled(false);
          setUpdateButtonClicked(true);
          setIsEditing(false);
        })
        .catch((error) => {
          console.error("Error updating employee:", error);
          // Handle the error or show an error message
        });
    } else {
      // Create a new object with the date part
      const employeeToSave = {
        ...employeeDetails,
      };

      // Send the employee details to the backend API for insertion
      axios
        .post(`${apiURL}/api/employees/insertFilemaster`, employeeToSave)
        .then((response) => {
          // console.log("Employee saved:", response.data);
          window.alert("Data saved successfully!");
          handleAddOne();
          setEmployeeDetails({
            Cupboard_Code: "",
            Employee_Name: "",
            
          });
        })
        .catch((error) => {
          console.error("Error saving employee:", error);
          // Handle the error or show an error message
        });
    }
  };

  const handleBack = () => {
    navigate("/employeemasterutility");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      // Add a confirmation dialog to make sure the user really wants to delete

      axios
        .delete(
          `${apiURL}/api/employees/deletcupboardmaster/${employeeDetails.Cupboard_Code}`
        )
        .then((response) => {
          // console.log("Employee deleted:", response.data);
          // Optionally, perform other actions after a successful delete
          handleCancel()
          setAddOneButtonEnabled(true);
          setEditButtonEnabled(true);
          setDeleteButtonEnabled(true);
          setBackButtonEnabled(true);
          setSaveButtonEnabled(false);
          setCancelButtonEnabled(false);
        })
        .catch((error) => {
          console.error("Error deleting employee:", error);
        });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsEditMode(false);
    setAddOneButtonEnabled(true);
    setEditButtonEnabled(true);
    setDeleteButtonEnabled(true);
    setBackButtonEnabled(true);
    setSaveButtonEnabled(false);
    setCancelButtonEnabled(false);
    setCancelButtonClicked(true);

    // Use Axios to make a GET request to fetch the last record
    axios
      .get(`${apiURL}/api/employees/getlastrecordcupboardmaster`)
      .then((response) => {
        // Assuming the response contains the last record data
        const lastRecord = response.data.lastCupBoardMaster;

        // Set the values from the last record to the state
        setEmployeeDetails({
          Cupboard_Code: lastRecord.Cupboard_Code,
          Cupboard_Name: lastRecord.Cupboard_Name,
         
        });
       
      })
      .catch((error) => {
        console.error("Error fetching last record:", error);
      });
  };

  const handleKeyDown = (event, handler) => {
    if (event.key === "Enter") {
      handler();
      addNewButtonRef.current.focus();
      if (handler === handleAddOne || handler === handleEdit) {
        if (resaleMillDropdownRef.current) {
          resaleMillDropdownRef.current.focus();
        }
      }
    }
  };


  
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validation function for float values
    const isValidFloat = (input) => /^\d+(\.\d*)?$/.test(input);

    // Validate input based on the field name
    switch (name) {
      case "Basic_Salary":
        if (!/^\d+$/.test(value)) {
          console.error(
            "Invalid Basic Salary value. Please enter a valid integer."
          );
          // Clear the field when an invalid value is entered
          setEmployeeDetails({
            ...employeeDetails,
            [name]: "",
          });
          return;
        }
        break;

      case "Rate_Per_Hour":
        if (!isValidFloat(value)) {
          console.error(
            "Invalid Rate Per Hour value. Please enter a valid float."
          );

          setEmployeeDetails({
            ...employeeDetails,
            [name]: "",
          });
          return;
        }
        break;

      default:
        break;
    }

    // Update state if validation passes
    setEmployeeDetails({
      ...employeeDetails,
      [name]: value,
    });
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Employee details submitted:", {
      ...employeeDetails,
    
    });
  };

 
  const location = useLocation();
  const editRecordData = location.state && location.state.editRecordData;

  // console.log("editRecordData", editRecordData);

  useEffect(() => {
    if (editRecordData) {
      setEmployeeDetails({
        ...editRecordData,
      });
      setAddOneButtonEnabled(true);
      setEditButtonEnabled(true);
      setDeleteButtonEnabled(true);
      setBackButtonEnabled(true);
      setSaveButtonEnabled(false);
      setCancelButtonEnabled(false);
      setCancelButtonClicked(true);
    } else {
      handleAddOne();
    }
  }, [editRecordData]);

  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [records, setRecords] = useState([]);

  const fetchFirstRecord = () => {
    axios
      .get(`${apiURL}/api/employees/getfirstnavigationcupboard`)
      .then((response) => {
        const firstRecord = response.data.firstUserCreation;
        setEmployeeDetails(firstRecord);
        setRecords([firstRecord]);
        setCurrentRecordIndex(0);
        
      });
  };

  const fetchLastRecord = () => {
    axios
      .get(`${apiURL}/api/employees/getlastnavigationcupboard`)
      .then((response) => {
        const lastRecord = response.data.lastUserCreation;
        setEmployeeDetails(lastRecord);
        setRecords([lastRecord]);
        setCurrentRecordIndex(0);
        
      });
  };

  const fetchPreviousRecord = async () => {
    // const currentEmployeeCode = records[currentRecordIndex].employeeCode;
    const response = await axios.get(
      `${apiURL}/api/employees/getpreviousnavigationcupboard/${employeeDetails.Cupboard_Code}`
    );

    if (response.data.previousUserCreation) {
      const previousRecord = response.data.previousUserCreation;
      setEmployeeDetails(previousRecord);
      setCurrentRecordIndex(currentRecordIndex - 1);
    } else {
      console.log("No previous record available.");
    }
  };

  const fetchNextRecord = async () => {
    // const currentEmployeeCode = records[currentRecordIndex].employeeCode;
    const response = await axios.get(
      `${apiURL}/api/employees/getnextnavigationcupboard/${employeeDetails.Cupboard_Code}`
    );

    if (response.data.nextUserCreation) {
      const nextRecord = response.data.nextUserCreation;
      setEmployeeDetails(nextRecord);
      setCurrentRecordIndex(currentRecordIndex + 1);
      
    } else {
      console.log("No next record available.");
    }
  };

  const handleFirst = () => {
    fetchFirstRecord();
  };

  const handleLast = () => {
    fetchLastRecord();
  };

  const handlePrevious = () => {
    fetchPreviousRecord();
  };

  const handleNext = () => {
    fetchNextRecord();
  };

  return (
    <>
      <div>
        <h3 className="mt-4 mb-4 text-center custom-heading">
          CupBoard Master
        </h3>
        <div
          style={{
            marginTop: "30px",
            marginBottom: "10px",
            display: "flex",
            gap: "10px",
            marginLeft: "600px",
          }}
        >
          <button
            onClick={handleAddOne}
            ref={addNewButtonRef}
            disabled={!addOneButtonEnabled}
            onKeyDown={(event) => handleKeyDown(event, handleAddOne)}
            tabIndex=""
            style={{
              backgroundColor: addOneButtonEnabled ? "blue" : "white",
              color: addOneButtonEnabled ? "white" : "black",
              border: "1px solid #ccc",
              cursor: "pointer",
              width: "6%",
              height: "35px",
              fontSize: "12px",
            }}
          >
            Add
          </button>
          {isEditMode ? (
            <button
              onClick={handleSaveOrUpdate}
              onKeyDown={(event) => handleKeyDown(event, handleSaveOrUpdate)}
              style={{
                backgroundColor: "blue",
                color: "white",
                border: "1px solid #ccc",
                cursor: "pointer",
                width: "6%",
                height: "35px",
                fontSize: "12px",
              }}
            >
              update
            </button>
          ) : (
            <button
              onClick={handleSaveOrUpdate}
              disabled={!saveButtonEnabled}
              onKeyDown={(event) => handleKeyDown(event, handleSaveOrUpdate)}
              tabIndex="2"
              style={{
                backgroundColor: saveButtonEnabled ? "blue" : "white",
                color: saveButtonEnabled ? "white" : "black",
                border: "1px solid #ccc",
                cursor: saveButtonEnabled ? "pointer" : "not-allowed",
                width: "6%",
                height: "35px",
                fontSize: "12px",
              }}
            >
              Save
            </button>
          )}
          <button
            onClick={handleEdit}
            disabled={!editButtonEnabled}
            onKeyDown={(event) => handleKeyDown(event, handleEdit)}
            style={{
              backgroundColor: editButtonEnabled ? "blue" : "white",
              color: editButtonEnabled ? "white" : "black",
              border: "1px solid #ccc",
              cursor: editButtonEnabled ? "pointer" : "not-allowed",
              width: "6%",
              height: "35px",
              fontSize: "12px",
            }}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={!deleteButtonEnabled}
            style={{
              backgroundColor: deleteButtonEnabled ? "blue" : "white",
              color: deleteButtonEnabled ? "white" : "black",
              border: "1px solid #ccc",
              cursor: deleteButtonEnabled ? "pointer" : "not-allowed",
              width: "6%",
              height: "35px",
              fontSize: "12px",
            }}
          >
            Delete
          </button>
          <button
            onClick={handleCancel}
            disabled={!cancelButtonEnabled}
            onKeyDown={(event) => handleKeyDown(event, handleCancel)}
            tabIndex="3"
            style={{
              backgroundColor: cancelButtonEnabled ? "blue" : "white",
              color: cancelButtonEnabled ? "white" : "black",
              border: "1px solid #ccc",
              cursor: cancelButtonEnabled ? "pointer" : "not-allowed",
              width: "6%",
              height: "35px",
              fontSize: "12px",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleBack}
            disabled={!backButtonEnabled}
            onKeyDown={(event) => handleKeyDown(event, handleBack)}
            tabIndex="4"
            style={{
              backgroundColor: backButtonEnabled ? "blue" : "white",
              color: backButtonEnabled ? "white" : "black",
              border: "1px solid #ccc",
              cursor: backButtonEnabled ? "pointer" : "not-allowed",
              width: "6%",
              height: "35px",
              fontSize: "12px",
            }}
          >
            Back
          </button>


          <div style={{ display:"flex", justifyContent: "space-between", marginLeft: "100px" }}>

          <button
            onClick={handleFirst}
            tabIndex="5"
            style={{
              backgroundColor: "blue",
              color: "white",
              border: "1px solid #ccc",
              cursor: "pointer",
              width: "200px",
              height: "35px",
              fontSize: "12px",
             
              
            }}
          >
            &lt;&lt; 
          </button>
          <button
            onClick={handlePrevious}
            tabIndex="6"
            style={{
              backgroundColor: "blue",
              color: "white",
              border: "1px solid #ccc",
              cursor: "pointer",
              width: "100%",
              height: "35px",
              fontSize: "12px",
              marginLeft:"5px"
            }}
          >
            &lt; 
          </button>
          <button
            onClick={handleNext}
            tabIndex="7"
            style={{
              backgroundColor: "blue",
              color: "white",
              border: "1px solid #ccc",
              cursor: "pointer",
              width: "100%",
              height: "35px",
              fontSize: "12px",
              marginLeft:"5px"
            }}
          >
             &gt;
          </button>
          <button
            onClick={handleLast}
            tabIndex="8"
            style={{
              backgroundColor: "blue",
              color: "white",
              border: "1px solid #ccc",
              cursor: "pointer",
              width: "100%",
              height: "35px",
              fontSize: "12px",
              marginLeft:"5px"
            }}
          >
            &gt;&gt; 
          </button>
          </div>




        </div>
      </div>
    

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "20vh",
          marginLeft: "500px",
        }}
      >
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
            <label className="form-label col-md-2" style={{ fontWeight: 'bold' }}>Cupboard Code :</label>

              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  name="Cupboard_Code"
                  value={employeeDetails.Cupboard_Code}
                  onChange={handleInputChange}
                  autoComplete="off"
                  readOnly
                  disabled={true}
                />
              </div>
            </div>

            <div className="row mb-3">
              <label className="form-label col-md-2"  style={{ fontWeight: 'bold' }}>Cupboard Name :</label>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  name="Cupboard_Name"
                  value={employeeDetails.Cupboard_Name}
                  onChange={handleInputChange}
                  autoComplete="off"
                  disabled={!isEditing}
                  tabIndex="1"
                />
              </div>
            </div>

          
            <div></div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EmployeeMasterComponent;