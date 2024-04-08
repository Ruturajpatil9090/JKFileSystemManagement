import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";


function UserCreationUtility() {
  const apiURL = process.env.REACT_APP_API_URL

  const [fetchedData, setFetchedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {

      try {
        const apiUrl = `${apiURL}/api/employees/getallFiles`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        // console.log("data is",data)
        setFetchedData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = fetchedData.filter(post => {
      const searchTermLower = searchTerm.toLowerCase();
  
      // Check if the searchTerm is included in specific fields
      if (
 
        post.File_Name.toLowerCase().includes(searchTermLower) ||
        post.File_Discription.toLowerCase().includes(searchTermLower)
      ) {
        return true;
      }
  
      return false;
    });
  
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterValue, fetchedData]);
  
  

  const handleSearchTermChange = (event) => {
    const term = event.target.value;

    setSearchTerm(term);
  };

  const pageCount = Math.ceil(filteredData.length / perPage);

  const paginatedPosts = filteredData.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleClick = () => {
    navigate("/File_Information");
  };

  const handleRowClick = (Doc_No) => {
    const selectedEmployee = fetchedData.find((employee) => employee.Doc_No === Doc_No);
    navigate("/File_Information", { state: { editRecordData: selectedEmployee } });
  };

  const handleBackButton = () => {
    navigate("/home")
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <button className="btn btn-primary" onClick={handleClick}>
            Add
          </button>
          <button className="btn btn-secondary ms-2" onClick={handleBackButton}>
            Back
          </button>
        </div>


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
              <button className="btn btn-outline-secondary rounded-pill" type="button">
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
      </div>


      <br></br>

      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Doc Code</th>
            <th>Doc_Date </th>
            <th>File_Name</th>
            <th>File_Discription</th>
            <th>Cupboard_Code</th>
            <th>File No</th>
            <th>Cupboard Name</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPosts.map((post) => (
            <tr
              key={post.Doc_No}
              className="row-item"
              onDoubleClick={() => handleRowClick(post.Doc_No)}
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
              className={`page-item ${index + 1 === currentPage ? "active" : ""
                }`}
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
    </div>
  );
}

export default UserCreationUtility;
