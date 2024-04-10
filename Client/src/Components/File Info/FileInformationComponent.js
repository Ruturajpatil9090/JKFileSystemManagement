import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CupBoardMasterHelp from "./CupBoardmasterHelp"
import axios from "axios";
import "../../App.css"

var employeeCodeNew = "";
var maxFileNoNew = ""
var SlectedUserIdNew = ""
var SelectUserName = ""

const UserCreationCompoenent = () => {
    const apiURL = process.env.REACT_APP_API_URL;
   
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
    const [editedrecord, setEditedrecord] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
    const [cupboardCode, setCupboardCode] = useState("");
    const [maxFileNo, setMaxFileNo] = useState(0);

    const [Disabledfeilds, setDisabledFeilds] = useState(false);

    const editButtonRef = useRef(null);
    const updateButtonRef = useRef(null);
    const setfocusFilenameref = useRef(null);
    const addNewButtonRef = useRef(null);
    const HelpfocusRef = useRef(null)




    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [employeeDetails, setEmployeeDetails] = useState({
        Doc_No: "",
        Doc_Date: getCurrentDate(),
        File_Name: "",
        File_Discription: "",
        Cupboard_Code: "",
        File_No: "",

    });
    const navigate = useNavigate();

    useEffect(() => {
        // Set the current date for Doc_Date when the component mounts
        setEmployeeDetails((prevState) => ({
            ...prevState,
            Doc_Date: getCurrentDate(),
        }));

       
    }, []);




    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Check if the entered value is a valid integer for the mobile number
        if (name === "Mobile_No" && !/^\d*$/.test(value)) {
            // If not a valid integer, don't update the state
            return;
        }

        setEmployeeDetails({
            ...employeeDetails,
            [name]: value,
            Doc_Date: getCurrentDate(),
        });
    };


    const handleAddOne = () => {
        // Disable and enable buttons as needed
        setAddOneButtonEnabled(false);
        setSaveButtonEnabled(true);
        setCancelButtonEnabled(true);
        setEditButtonEnabled(false);
        setDeleteButtonEnabled(false);
        setIsEditMode(false);
        setIsEditing(true);
        setDisabledFeilds(false);

        // Fetch the last employee code from the API
        axios
            .get(`${apiURL}/api/employees/lastFileCode`)
            .then((response) => {
                // Assuming the API response contains the last employee code
                const lastEmployeeCode = response.data.lastUserCreation;
                maxFileNoNew = ""
                SlectedUserIdNew = ""
                SelectUserName = ""
             
                // Set the last employee code to the employeeDetails
                setEmployeeDetails({
                    Doc_No: lastEmployeeCode + 1,
                    Doc_Date: "",
                    File_Name: "",
                    File_Discription: "",
                    Cupboard_Code: "",
                    File_No: "",
                  
                });
               
                // window.location.reload();
                selectedUserId = ""
                cupboardCode = ""
                setCurrentIndex(response.data.length - 1);
               
 
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
       
  
        employeeCodeNew = employeeDetails.Doc_No;
        //updateButtonRef.current.focus();
    };

    useEffect(() => {
        if (isEditMode) {
            setfocusFilenameref.current.focus();
        }
        else {
            addNewButtonRef.current.focus();
        }
       
    }, [isEditMode]);


    // Fetch the maximum File_No for the selected Cupboard_Code
    const fetchMaxFileNo = () => {
        axios
            .get(`${apiURL}/api/employees/getLastCupboardCode/${selectedUserId}`)
            .then((response) => {

                const maxFileNo = response.data.maxFileNo;
                maxFileNoNew = maxFileNo + 1
                setMaxFileNo(maxFileNo);

                console.log("maxFileNo", maxFileNo)
            })
            .catch((error) => {
                console.error("Error fetching max File_No:", error);
            });
    };

    // Call fetchMaxFileNo when the selectedUserId changes
    useEffect(() => {
        if (selectedUserId) {
            fetchMaxFileNo();
        }
    }, [selectedUserId]);

    const handleSaveOrUpdate = () => {
        if (isEditMode) {
            axios
                .put(
                    `${apiURL}/api/employees/updatefile/${employeeDetails.Doc_No}`,
                    employeeDetails
                )
                .then((response) => {
                    console.log("Data updated successfully:", response.data);
                    setIsEditMode(false);
                    setAddOneButtonEnabled(true);
                    setEditButtonEnabled(true);
                    setDeleteButtonEnabled(true);
                    setBackButtonEnabled(true);
                    setSaveButtonEnabled(false);
                    setCancelButtonEnabled(false);
                    setUpdateButtonClicked(true);
                    setIsEditing(false);
                    addNewButtonRef.current.focus();
                })
                
                .catch((error) => {
                    console.error("Error updating data:", error);
                });
        } else {


            // Set selectedUserId to Cupboard_Code before saving
            const updatedEmployeeDetails = { ...employeeDetails, Cupboard_Code: selectedUserId, CupBoardCode_Name: selectedEmployeeName };

            axios

                .post(`${apiURL}/api/employees/insertfile`, updatedEmployeeDetails)
                .then((response) => {
                    console.log("Data saved successfully:", response.data);
                    window.alert("Data saved successfully!");
                    window.location.reload();
                    setIsEditMode(false);
                    setAddOneButtonEnabled(true);
                    setEditButtonEnabled(true);
                    setDeleteButtonEnabled(true);
                    setBackButtonEnabled(true);
                    setSaveButtonEnabled(false);
                    setCancelButtonEnabled(false);
                    addNewButtonRef.current.focus();
                    setSaveButtonClicked(true);
                    setIsEditing(true);
                })
                .catch((error) => {
                    console.error("Error saving data:", error);
                });
        }
    };

    const handleBack = () => {
        navigate("/File_Info_Utility");
    };

    const handleDelete = () => {
        setIsEditMode(false);
        setAddOneButtonEnabled(true);
        setEditButtonEnabled(true);
        setDeleteButtonEnabled(true);
        setBackButtonEnabled(true);
        setSaveButtonEnabled(false);
        setCancelButtonEnabled(false);
        axios
            .delete(`${apiURL}/api/employees/deletefile/${employeeDetails.Doc_No}`)
            .then((response) => {
                console.log("User deleted successfully:", response.data);
                window.alert("User deleted successfully")
                // window.location.reload();
                handleCancel()
            })
            .catch((error) => {
                console.error("Error during API call:", error);
            });
    };

    const handleCancel = () => {
        setIsEditMode(false);
        setAddOneButtonEnabled(true);
        setEditButtonEnabled(true);
        setDeleteButtonEnabled(true);
        setBackButtonEnabled(true);
        setSaveButtonEnabled(false);
        setCancelButtonEnabled(false);
        setCancelButtonClicked(true);
        setIsEditing(false);
        setDisabledFeilds(true);
  
        // Use Axios to make a GET request to fetch the last record
        axios
            .get(`${apiURL}/api/employees/getlastfilebyid`)
            .then((response) => {
                // Assuming the response contains the last record data
                const lastRecord = response.data.lastUserCreation;
                employeeCodeNew = response.data.lastUserCreation.employeeCode;
                maxFileNoNew = lastRecord.File_No;
                SlectedUserIdNew = lastRecord.Cupboard_Code
                SelectUserName = lastRecord.CupBoardCode_Name
                setCupboardCode(lastRecord.Cupboard_Code);
                setEmployeeDetails({
                    Doc_No: lastRecord.Doc_No,
                    Doc_Date: lastRecord.Doc_Date,
                    File_Name: lastRecord.File_Name,
                    File_Discription: lastRecord.File_Discription,
                    Cupboard_Code: lastRecord.Cupboard_Code,

                });
                editButtonRef.current.focus();
            })
            .catch((error) => {
                console.error("Error fetching last record:", error);
            });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };
    const handleButtonClick = (button) => {
        setHighlightedButton(button);
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

    const location = useLocation();
    const editRecordData = location.state && location.state.editRecordData;
 

    useEffect(() => {
        if (editRecordData) {
            handlerecordDoubleCliked();
        
            setAddOneButtonEnabled(true);
            setEditButtonEnabled(true);
            setDeleteButtonEnabled(true);
            setBackButtonEnabled(true);
            setSaveButtonEnabled(false);
            setCancelButtonEnabled(false);
            setCancelButtonClicked(true);
            setDisabledFeilds(true);
        } else {
            handleAddOne();
        }
    }, [editRecordData]);


    const handlerecordDoubleCliked = () => {
        setIsEditMode(false);
        setAddOneButtonEnabled(true);
        setEditButtonEnabled(true);
        setDeleteButtonEnabled(true);
        setBackButtonEnabled(true);
        setSaveButtonEnabled(false);
        setCancelButtonEnabled(false);
        setCancelButtonClicked(true);
        setIsEditing(false);
        setDisabledFeilds(true);
        // Use Axios to make a GET request to fetch the last record
    axios
    .get(`${apiURL}/api/employees/getdatabyDocNo/${editRecordData.Doc_No}`)
    .then((response) => {
        // Assuming the response contains the record data
        const recordData = response.data.getdataByDocNo;
        
        setCupboardCode(recordData.Cupboard_Code); 
        SlectedUserIdNew = recordData.Cupboard_Code;
        SelectUserName = recordData.CupBoardCode_Name;
        maxFileNoNew = recordData.File_No;
       
        setEmployeeDetails({
            Doc_No: recordData.Doc_No,
            Doc_Date: recordData.Doc_Date,
            File_Name: recordData.File_Name,
            File_Discription: recordData.File_Discription,
            Cupboard_Code: recordData.Cupboard_Code,
            File_No : recordData.File_No
           
        });
    })
    .catch((error) => {
        console.error("Error fetching record:", error);
    });
};



    const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
    const [records, setRecords] = useState([]);

    const fetchFirstRecord = () => {
        axios.get(`${apiURL}/api/employees/getfirstnavigationfile`).then((response) => {
            const firstRecord = response.data.firstUserCreation;
            maxFileNoNew = response.data.firstUserCreation.File_No
            SlectedUserIdNew =  response.data.firstUserCreation.Cupboard_Code;
            SelectUserName = response.data.firstUserCreation.CupBoardCode_Name;
            setEmployeeDetails(firstRecord);
            setRecords([firstRecord]);
            setCurrentRecordIndex(0);
        });
    };

    const fetchLastRecord = () => {
        axios.get(`${apiURL}/api/employees/getlastnavigationfile`).then((response) => {
            const lastRecord = response.data.lastUserCreation;
            maxFileNoNew = response.data.lastUserCreation.File_No;
            SlectedUserIdNew =  response.data.lastUserCreation.Cupboard_Code;
            SelectUserName = response.data.lastUserCreation.CupBoardCode_Name;
            setEmployeeDetails(lastRecord);
            setRecords([lastRecord]);
            setCurrentRecordIndex(0);
        });
    };

    const fetchPreviousRecord = async () => {
        // const currentEmployeeCode = records[currentRecordIndex].employeeCode;
        const response = await axios.get(
            `${apiURL}/api/employees/getpreviousnavigationfile/${employeeDetails.Doc_No}`
        );

        if (response.data.previousUserCreation) {
            const previousRecord = response.data.previousUserCreation;
            maxFileNoNew = response.data.previousUserCreation.File_No;
            SlectedUserIdNew =  response.data.previousUserCreation.Cupboard_Code;
            SelectUserName = response.data.previousUserCreation.CupBoardCode_Name;
            setEmployeeDetails(previousRecord);
            setCurrentRecordIndex(currentRecordIndex - 1);
        } else {
            console.log("No previous record available.");
        }
    };

    const fetchNextRecord = async () => {
        // const currentEmployeeCode = records[currentRecordIndex].employeeCode;
        const response = await axios.get(
            `${apiURL}/api/employees/getnextnavigationfile/${employeeDetails.Doc_No}`
        );

        if (response.data.nextUserCreation) {
            const nextRecord = response.data.nextUserCreation;
            maxFileNoNew = response.data.nextUserCreation.File_No;
            SlectedUserIdNew =  response.data.nextUserCreation.Cupboard_Code;
            SelectUserName = response.data.nextUserCreation.CupBoardCode_Name;
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

    const handleEmployeeCode = (code, name) => {

        setSelectedUserId(code);
        setSelectedEmployeeName(name);

    };



    return (
        <>
            <div>
                <h3 className="mt-4 mb-4 text-center custom-heading">
                    File Information
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
                        tabIndex={0}
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
                            ref={updateButtonRef}
                            tabindex="4" 
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
                            tabindex="4" 
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
                        ref={editButtonRef}
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
                        tabindex="5" 
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
                        tabindex="6" 
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

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginLeft: "100px",
                        }}
                    >
                        <button
                            onClick={handleFirst}
                            tabindex="7"
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
                            tabindex="8"
                            style={{
                                backgroundColor: "blue",
                                color: "white",
                                border: "1px solid #ccc",
                                cursor: "pointer",
                                width: "100%",
                                height: "35px",
                                fontSize: "12px",
                                marginLeft: "5px",
                            }}

                        >
                            &lt;
                        </button>
                        <button
                            onClick={handleNext}
                            tabindex="9"
                            style={{
                                backgroundColor: "blue",
                                color: "white",
                                border: "1px solid #ccc",
                                cursor: "pointer",
                                width: "100%",
                                height: "35px",
                                fontSize: "12px",
                                marginLeft: "5px",
                            }}
                        >
                            &gt;
                        </button>
                        <button
                            onClick={handleLast}
                            tabindex="10"
                            style={{
                                backgroundColor: "blue",
                                color: "white",
                                border: "1px solid #ccc",
                                cursor: "pointer",
                                width: "100%",
                                height: "35px",
                                fontSize: "12px",
                                marginLeft: "5px",
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
                    height: "70vh",
                    marginLeft: "500px",
                }}
            >
                <div className="container">
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <label className="form-label col-md-2" style={{ fontWeight: 'bold' }}>Doc No:</label>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="Doc_No"
                                    value={employeeDetails.Doc_No}
                                    onChange={handleInputChange}
                                    autoComplete="off"
                                    disabled
                                   
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label className="form-label col-md-2" style={{ fontWeight: 'bold' }}>Doc Date:</label>
                            <div className="col-md-4">
                                <input
                                    type="date"
                                    className="form-control"
                                    name="Doc_Date"
                                    value={getCurrentDate()}
                                    onChange={handleInputChange}
                                    autoComplete="off"
                                    disabled
                                
                                />
                            </div>
                        </div>

                        <CupBoardMasterHelp ref={HelpfocusRef}   onAcCodeClick={handleEmployeeCode} newCupBoardCode={cancelButtonClicked ? SlectedUserIdNew :"" }
                        newUserName= {cancelButtonClicked ? SelectUserName : ""} Disabledfeilds = {Disabledfeilds} />
                        <br></br>

                        <div className="row mb-3">
                            <label className="form-label col-md-2" style={{ fontWeight: 'bold' }}>File name:</label>
                            <div className="col-md-4">
                                <input
                                ref={setfocusFilenameref}
                                    type="text"
                                    className="form-control"
                                    name="File_Name"
                                    value={employeeDetails.File_Name}
                                    onChange={handleInputChange}
                                    autoComplete="off"
                                    disabled={!isEditing}
                                    tabindex="2" 
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label className="form-label col-md-2" style={{ fontWeight: 'bold' }}>File Description:</label>
                            <div className="col-md-4">
                                <textarea
                                    className="form-control"
                                    name="File_Discription"
                                    value={employeeDetails.File_Discription}
                                    onChange={handleInputChange}
                                    autoComplete="off"
                                    disabled={!isEditing}
                                    rows={10} 
                                    tabindex="3" 
                                />
                            </div>
                        </div>


                        <div className="row mb-3">
                            <label className="form-label col-md-2" style={{ fontWeight: 'bold' }}>File No:</label>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="File_No"
                                    value={maxFileNoNew}
                                    onChange={handleInputChange}
                                    autoComplete="off"
                                    disabled
                                 
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
export default UserCreationCompoenent;
