import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../newOfficer/list.scss";
import "../../components/OfficerDatatable/datatable.scss"
import React from 'react';
import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import mobileDataService from "../../services/mobile.services";




const ListMobile = () => {

    const [message, setMessage] = useState({ errors: false, msg: "" });
    const [user, setUser] = useState([]);

  // Asynchronously fetch user data 
  const getuser = async () => {
    const data = await mobileDataService.getAllUser();
    // Process the fetched data and add 'id' properties to each user
    const user = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    // Set officer data to state
    setUser(user);
  };

  useEffect(() => {
    // Fetch user data 
    getuser();
  }, []);


    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />



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

                            <div> Mobile User Details</div>

                        </div>

                    </div>





                    <DataGrid
                        className="datagrid"
                        rows={user}
                        columns={[
                            // Define columns 
                   
                            { field: "name", headerName: "Full Name", width: 150 },
                            { field: "phone", headerName: " Phone", width: 150 },
                            { field: "nic", headerName: " NIC", width: 150 },
                            { field: "address", headerName: "Address", width: 200 },
                            { field: "email", headerName: " Email", width: 200 },
                            


                       
                        ]}
                        pageSize={9}
                        rowsPerPageOptions={[9]}
                        checkboxSelection
                    />
                </div>

            </div>
        </div>
    )
}
export default ListMobile;