import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./Search.css"
import { useNavigate } from "react-router-dom";

function UserCreationUtility() {
    const apiURL = process.env.REACT_APP_API_URL;

    const [fetchedData, setFetchedData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filterValue, setFilterValue] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = `${apiURL}/api/employees/getallFiles`;
                const response = await fetch(apiUrl);
                const data = await response.json();
                setFetchedData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const filtered = fetchedData.filter((post) => {
            const searchTermLower = searchTerm.toLowerCase();
            const userName = (post.File_Name || "").toLowerCase();
            const fileDescription = (post.File_Discription || "").toLowerCase();

            return (
                (filterValue === "" || post.group_Type === filterValue) &&
                (userName.includes(searchTermLower) ||
                    fileDescription.includes(searchTermLower))
            );
        });

        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchTerm, filterValue, fetchedData]);

    const handleSearchTermChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
    };

    const pageCount = Math.ceil(filteredData.length / perPage);

    const paginatedPosts = filteredData.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowClick = (record) => {
        setSelectedRecord(record);
    };

    const handleSearchButtonClick = () => {
        // Assuming the first record from filtered data should be shown
        if (filteredData.length > 0) {
            setSelectedRecord(filteredData[0]);
        }
    };

    const handleClosePopup = () => {
        setSelectedRecord(null);
    };

    const handleBackButton = () => {
        navigate("/home")
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-4 d-flex justify-content-end">

                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="Search By Employee Name..."
                            value={searchTerm}
                            onChange={handleSearchTermChange}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary rounded-pill"
                                type="button"
                                onClick={handleSearchButtonClick}
                            >
                                <FaSearch />
                            </button>
                        </div>

                    </div>
                    <button className="btn btn-primary ms-2" onClick={handleBackButton}>
                        Back
                    </button>
                </div>
            </div>

            <br></br>

            <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>Doc No</th>
                        <th>Doc Date</th>
                        <th>File Name</th>
                        <th>File Description</th>
                        <th>Cupboard Code</th>
                        <th>File No</th>
                        <th>Cupboard Name</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedPosts.map((post) => (
                        <tr
                            key={post.User_Code}
                            className="row-item"
                            onClick={() => handleRowClick(post)}
                        >
                            <td>{post.Doc_No}</td>
                            <td>{post.Doc_Date}</td>
                            <td>{post.File_Name}</td>
                            <td>{post.File_Discription}</td>
                            <td>{post.Cupboard_Code}</td>
                            <td>{post.File_No}</td>
                            <td>{post.CupBoardCode_Name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <nav>
                <ul className="pagination justify-content-center">
                    {Array.from({ length: pageCount }).map((_, index) => (
                        <li
                            key={index}
                            className={`page-item ${index + 1 === currentPage ? "active" : ""}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Popup or Modal to show the selected record details */}
            {selectedRecord && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={handleClosePopup}>
                            &times;
                        </span>
                        <h3>Selected Record Details</h3>
                        <h5 style={{ color: 'blue' }}>Cupboard Code: {selectedRecord.Cupboard_Code}</h5>
                        <h5 style={{ color: 'blue' }}>File No: {selectedRecord.File_No}</h5>
                        <h5 style={{ color: 'blue' }}>Cupboard Name: {selectedRecord.CupBoardCode_Name}</h5>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserCreationUtility;
