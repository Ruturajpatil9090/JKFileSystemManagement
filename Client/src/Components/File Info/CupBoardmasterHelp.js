import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import DataTableSearch from "../../common/DataTableSearch";
import DataTablePagination from "../../common/DataTablePagination";
import axios from "axios";
import "../../App.css";

var lActiveInputFeild = "";

const ApiDataTableModal = ({ onAcCodeClick, name,}) => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [showModal, setShowModal] = useState(false);
  const [popupContent, setPopupContent] = useState([]);
  const [Cupboard_Code, setEnteredAcCode] = useState("");
  const [Cupboard_Name, setEnteredAcName] = useState("");
  const [enteredAccoid, setEnteredAccoid] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const [apiDataFetched, setApiDataFetched] = useState(false);
  const itemsPerPage = 10;

  // Fetch data based on API
  const fetchAndOpenPopup = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/employees/getallCupBoard`);
      const data = response.data;
      console.log("data", data);
      setPopupContent(data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!apiDataFetched) {
          await fetchAndOpenPopup();
          setApiDataFetched(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Check if popup was open before page reload
    const popupStatus = localStorage.getItem("popupStatus");
    if (popupStatus === "open") {
      fetchData();
    }

    return () => {
      // Clear popup status on page reload
      localStorage.removeItem("popupStatus");
    };
  }, [apiDataFetched]);

  // Handle Mill Code button click
  const handleMillCodeButtonClick = () => {
    lActiveInputFeild = name;
    fetchAndOpenPopup();
  };

  //popup functionality show and hide
  const handleCloseModal = () => {
    setShowModal(false);
    // Update popup status on close
    localStorage.setItem("popupStatus", "closed");
  };

  const handleAcCodeChange = async (event, item) => {
    const { value } = event.target;
    setEnteredAcCode(value);
      setEnteredAcName(""); // Reset Cupboard_Name while the data is being fetched
      try {
        const response = await axios.get(`${apiURL}/api/employees/getallCupBoard`);
        const data = response.data;
        setPopupContent(data);
        setApiDataFetched(true);

        const matchingItem = data.find(
          (item) => item.Cupboard_Code === parseInt(value, 10)
        );

        if (matchingItem) {
          setEnteredAcCode(matchingItem.Cupboard_Code);
          setEnteredAcName(matchingItem.Cupboard_Name);
          if (onAcCodeClick) {
            onAcCodeClick(
              matchingItem.Cupboard_Code,
              matchingItem.Cupboard_Name
            );
          }
        } else {
          setEnteredAcName("");
          setEnteredAccoid("");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    
  };

  // After open popup onDoubleClick event that record display on the fields
  const handleRecordDoubleClick = (item) => {
    if (lActiveInputFeild === name) {
      setEnteredAcCode(item.Cupboard_Code);
      setEnteredAcName(item.Cupboard_Name);
      if (onAcCodeClick) {
        onAcCodeClick(item.Cupboard_Code, item.Cupboard_Name);
      }
    }
    setShowModal(false);
    // Update popup status on close
    localStorage.setItem("popupStatus", "closed");
  };

  // Handle pagination number
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle search functionality
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue.toLowerCase());
  };

  const filteredData = popupContent.filter((item) =>
    item.Cupboard_Name.toLowerCase().includes(searchTerm)
  );

  // Get unique items based on Employee_Code
  const uniqueItemsToDisplay = Array.from(
    new Set(filteredData.map((item) => item.Cupboard_Code))
  ).map((code) => {
    const matchingItem = filteredData.find(
      (item) => item.Cupboard_Code === code
    );
    return {
      Cupboard_Code: matchingItem.Cupboard_Code,
      Cupboard_Name: matchingItem.Cupboard_Name,
    };
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = uniqueItemsToDisplay.slice(startIndex, endIndex);

  // Handle key events

useEffect(() => {
    const handleKeyEvents = async (event) => {
      if (event.key === "F1") {
        // Open the popup modal when F1 key is pressed
        fetchAndOpenPopup();
        event.preventDefault(); // Prevent default behavior of the F1 key (browser help menu)
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedRowIndex((prev) => Math.max(prev - 1, 0));
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedRowIndex((prev) =>
          Math.min(prev + 1, itemsToDisplay.length - 1)
        );
      } else if (event.key === "Enter") {
        event.preventDefault();
        // Handle Enter key press to select the highlighted option
        if (selectedRowIndex >= 0) {
          handleRecordDoubleClick(itemsToDisplay[selectedRowIndex]);
        }
      }
    };
  
    window.addEventListener("keydown", handleKeyEvents);
  
    return () => {
      window.removeEventListener("keydown", handleKeyEvents);
    };
  }, [selectedRowIndex, itemsToDisplay, fetchAndOpenPopup, handleRecordDoubleClick]);
  

  return (
    <div className="d-flex flex-row ">
      <div className="d-flex ">
        <div className="d-flex">
          <label style={{fontWeight:"bold", marginRight: "90px"}}>Cupboard Code:</label>
          <input
            type="text"
            className="form-control ms-2"
            id={name}
            autoComplete="off"
            value={Cupboard_Code}
            tabIndex="1"

            onChange={handleAcCodeChange}
            style={{ width: "100px", height: "35px", marginLeft: "0px" }}
       
          />
          <Button
            variant="primary"
            onClick={handleMillCodeButtonClick}
            className="ms-1"
            style={{ width: "30px", height: "35px" }}
         
          >
            ...
          </Button>
          <label id="acNameLabel" className=" form-labels ms-2">
            {Cupboard_Name}
          </label>
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="modal-dialog "
      >
        <Modal.Header closeButton>
          <Modal.Title>CupBoard Master</Modal.Title>
        </Modal.Header>
        <DataTableSearch data={popupContent} onSearch={handleSearch} />
        <Modal.Body>
          {Array.isArray(popupContent) ? (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Cupboard Code</th>
                    <th>Cupboard Name</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsToDisplay.map((item, index) => (
                    <tr
                      key={index}
                      className={
                        selectedRowIndex === index ? "selected-row" : ""
                      }
                      onDoubleClick={() => handleRecordDoubleClick(item)}
                    >
                      <td>{item.Cupboard_Code}</td>
                      <td>{item.Cupboard_Name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            "Loading..."
          )}
        </Modal.Body>
        <Modal.Footer>
          <DataTablePagination
            totalItems={uniqueItemsToDisplay.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
         
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ApiDataTableModal;
