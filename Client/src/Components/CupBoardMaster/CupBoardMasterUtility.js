import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function EmployeeMasterUtility() {
  const apiURL = process.env.REACT_APP_API_URL;
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
        const apiUrl = `${apiURL}/api/employees/getallCupBoard`;
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
      const Cupboard_Name = (post.Cupboard_Name || "").toLowerCase();
      

      return (
        (filterValue === "" || post.group_Type === filterValue) &&
        Cupboard_Name.includes(searchTermLower)
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

  const handleClick = () => {
    navigate("/employeemaster");
  };

  const handleRowClick = (Cupboard_Code) => {
    const selectedEmployee = fetchedData.find(
      (employee) => employee.Cupboard_Code === Cupboard_Code
    );
    navigate("/employeemaster", {
      state: { editRecordData: selectedEmployee },
    });
  };

  // const handleSearchClick = () => {
  //   setFilterValue("");
  // };

  const handleBackButton = () => {
    navigate("/home");
  };



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
              <button
                className="btn btn-outline-secondary rounded-pill"
                type="button"
              >
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
            <th scope="col">Cupboard Code</th>
            <th scope="col">Cupboard Name</th>
            
          </tr>
        </thead>
        <tbody>
          {paginatedPosts.map((post) => (
            <tr
              key={post.Cupboard_Code}
              className="row-item"
              onDoubleClick={() => handleRowClick(post.Cupboard_Code)}
            >
              <td>{post.Cupboard_Code}</td>
              <td>{post.Cupboard_Name}</td>
            

            </tr>
          ))}
        </tbody>
      </table>

      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: pageCount }).map((_, index) => (
            <li
              key={index}
              className={`page-item ${
                index + 1 === currentPage ? "active" : ""
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

export default EmployeeMasterUtility;