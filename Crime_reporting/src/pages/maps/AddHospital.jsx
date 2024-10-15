import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./addPoliceStation.scss";
import React  from 'react';
import { DataGrid } from '@mui/x-data-grid';
import OfficerDataService from "../../services/officer.services";
import "../../components/OfficerDatatable/datatable.scss";
import HospitalLocationDataService from "../../services/hospital.services";
import { useEffect, useState } from "react";


const AddHospital = () => {

    const [message, setMessage] = useState({ errors: false, msg: "" });
    const [ID, setID] = useState();
    const [department, setDepartment] = useState();
    const [lat, setNewLat] = useState();
    const [lng, setNewLng] = useState();
    const [name, setNewName] = useState();
    const [con, setNewCon] = useState();
    const [location, setLocation] = useState();
    const [position, setPosition] = useState();
    const currentUser = JSON.parse(localStorage.getItem("authUser"));
    const lastUpdate = new Date(new Date().toISOString()).toLocaleString();
    const regex = /^(?:\d{3}[-]?)?\d{3}[- ]?\d{4}$/;




    const handleSubmitClick = async (e) => {
        
        try {

            // Validation
            if (!lat || !lng || !name || !con || !department ) {
                setMessage({ errors: true, msg: "Please fill in all fields correctly." });
                return;
            }

            if (!regex.test(con)) {
                setMessage({ errors: true, msg: "Please check Phone Number" });
                return;
            }

            const addNewLocation = {
                latitude: lat,
                longitude: lng,
                Hospital_Name: name,
                Contact: con,
                lastUpdate,
                Officer_PID: ID,
                officer_department: department,
                
            };
            const locationData = await HospitalLocationDataService.getAllLocation();
            const isLat = locationData.docs.some((doc) => doc.data().latitude === lat);
            const isLng = locationData.docs.some((doc) => doc.data().longitude === lng);

            if (!isLat || !isLng) {
                // Create a new location object 
                await HospitalLocationDataService.addlocation(addNewLocation);

                setMessage({ errors: false, msg: "Location added successfully!" });
                fetchLocation();
                window.location.reload();
               
            } else {
                setMessage({ errors: true, msg: "Location already exists!" });

            }
        } catch (error) {
            console.error("Error adding Location: ", error);
            setMessage({ errors: true, msg: "Error adding Location. Please try again." });



        }
    };

     // Function to fetch current user's position
     const fetchCurrentUser = async (email) => {
        const data = await OfficerDataService.getAllOfiicer();
        // Find the current user's officer data
        const currentUserOfficer = data.docs.find((doc) => doc.data().email === email);
        if (currentUserOfficer) {
            const userDepartment = currentUserOfficer.data().department;
            setDepartment(userDepartment);
            const policeId = currentUserOfficer.data().pid;
            setID(policeId);
            const position = currentUserOfficer.data().position;
            setPosition(position);
        }
    }


    useEffect(() => {
        // Fetch current user's position
        fetchCurrentUser(currentUser.email);
        //fetch location
        fetchLocation();
   
    }, []);


      //fetch police location data
      const fetchLocation = async () => {
        const data = await HospitalLocationDataService.getAllLocation();
        const getLocation = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));
        setLocation(getLocation);
    }

   //delete location
   const deleteHandler = async (id) => {
    try {
        await HospitalLocationDataService.deleteLocation(id);
        fetchLocation();
        setMessage({ errors: false, msg: "successfully Deleted Location!" });

    }
    catch (err) {
        setMessage({ errors: true, msg: err.message });
    }
}



    return(

        <div className="list">
            <Sidebar />

            <div className="listLocation">
                <Navbar />


                {/* alert msg */}
                {message?.msg && (
                    <div className={`alert ${message.errors ? "alert-danger" : "alert-success"}`}>
                        {message.msg}&nbsp;
                        <button className="close" onClick={() => setMessage("")}>
                            <span>&times;</span>
                        </button>
                    </div>
                )}



                <div className="addNew">

                    <div>Hospital Location</div>

                    <br />

                    <div className="contentBox">
                        <div className="datatable">

                            {location && location.length > 0 ? (
                                <DataGrid
                                    className="datagrid"
                                    rows={location}
                                    columns={[
                                        { field: "Hospital_Name", headerName: " Hospital", width: 200 },
                                        { field: "Contact", headerName: " Contact", width: 109 },
                                        { field: "latitude", headerName: " Latitude", width: 109 },
                                        { field: "longitude", headerName: " Longitude", width: 109 },
                                        { field: "Officer_PID", headerName: " Created By", width: 109 },

                                        {
                                            field: "action",
                                            headerName: "Action",
                                            width: 90,
                                            renderCell: (params) => (
                                                <div className="cellAction">

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
                            ) : (
                                <p>No data available</p>
                            )}

                        </div>

                        <div>

                        <div className="formInput">
                                <label>Latitude</label>
                                <input type="text" id="lat" onChange={(e) => setNewLat(e.target.value)} required/>
                            </div>

                            <div className="formInput">
                                <label>Longitude</label>
                                <input type="text" id="lng" onChange={(e) => setNewLng(e.target.value)} required />
                            </div>

                            <div className="formInput">
                                <label>Hospital Name</label>
                                <input type="text" id="Hospital_Name" onChange={(e) => setNewName(e.target.value)} required/>
                            </div>

                            <div className="formInput">
                                <label>Contact No</label>
                                <input type="text" id="conatct" onChange={(e) => setNewCon(e.target.value)} required/>
                            </div>

                            <div className="submitButton" onClick={handleSubmitClick}>Submit
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>
        </div>

    )
}
export default AddHospital;