import "./datatable.scss"
import { DataGrid } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import OfficerDataService from "../../services/officer.services";
import { useEffect, useState } from "react";
import React from 'react';
import { useUserAuth } from "../../context/UserAuthContext";
import SearchIcon from '@mui/icons-material/Search';


// data table for police officer details


const Datatable = () => {



  const { deleteUserData } = useUserAuth();

  const [message, setMessage] = useState({ errors: false, msg: "" });
  const [officer, setOfficer] = useState([]);
  const [position, setPosition] = useState();
  const currentUser = JSON.parse(localStorage.getItem("authUser"));


  useEffect(() => {
    // Fetch officer data 
    getOfficer(currentUser.email);
    // Fetch current user's position
    fetchCurrentUserPosition(currentUser.email);
  }, []);





  // Asynchronously fetch officer data 
  const getOfficer = async () => {
    const data = await OfficerDataService.getAllOfiicer();
    // Process the fetched data and add 'id' properties to each officer
    const officer = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    // Set officer data to state
    setOfficer(officer);
  };




  // Function to fetch current user's position
  const fetchCurrentUserPosition = async (email) => {
    const data = await OfficerDataService.getAllOfiicer();
    // Find the current user's officer data
    const currentUserOfficer = data.docs.find((doc) => doc.data().email === email);
    if (currentUserOfficer) {
      // Get the position of the current user
      const userPosition = currentUserOfficer.data().position;
      // Set the position in the component state
      setPosition(userPosition);
    }

  }




  //delete officer function
  const deleteHandler = async (id) => {
    try {
     
      // Delete the officer data from Firestore
      await OfficerDataService.deleteOfficer(id);
      // Fetch updated officer data
      getOfficer();
      setMessage({ errors: false, msg: "successfully deleted police officer!" });
    }
    catch (err) {
      setMessage({ errors: true, msg: err.message });
    }
  }





  return (
    <div className="datatable">

      {/* alert msg */}
      {message?.msg && (
        <div className={`alert ${message.errors ? "alert-danger" : "alert-success"}`}>
          {message.msg}&nbsp;
          <button className="close" onClick={() => setMessage("")}>
            <span>&times;</span>
          </button>
        </div>
      )}


      <div className="dataTableTitle">

        <div className="addNew">

          <div> Add New Officer</div>

          
            {position === "Chief" ? (
              <Link to="/officer/new" style={{ textDecoration: "none" }} className="link">
                Add New
              </Link>
            ) : null}
     

        </div>

      </div>


      


      <DataGrid
        className="datagrid"
        rows={officer}
        columns={[
          // Define columns 
          {
            field: "imageUpload",
            headerName: "Image",
            width: 100,
            renderCell: (params) => (
              <div className="cellWithImg">
                <img
                  src={params.value}
                  alt="Officer"
                  className="cellImg"
                />
              </div>
            ),
          },

          { field: "fname", headerName: "Full Name", width: 150 },
          { field: "position", headerName: " Position", width: 150 },
          { field: "department", headerName: " Department", width: 150 },
          { field: "email", headerName: " Email", width: 150 },
          { field: "phone", headerName: " Phone", width: 150 },


          {
            field: "action",
            headerName: "Action",
            width: 200,
            renderCell: (params) => (
              <div className="cellAction">


                <Link to={`/officer/${params.row.id}`} style={{ textDecoration: "none" }} >
                  <div className="viewButton">View</div>

                </Link>


                {position === "Chief" ? (
                  <div id="dButton" className="deleteButton" onClick={(e) => deleteHandler(params.row.id, params.row.email, params.row.password)}>Delete</div>
                ) : null}
              </div>

            ),
          },
        ]}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default Datatable;