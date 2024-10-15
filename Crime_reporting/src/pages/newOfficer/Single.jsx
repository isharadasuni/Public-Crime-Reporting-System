import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import Datatable from "../../components/OfficerDatatable/Datatable";
import "./single.scss";
import React from 'react';
import OfficerDataService from "../../services/officer.services";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';


//single user details page 
 

const Single = () => {

    // Get the user ID from the URL parameter
    let { id } = useParams();
    const [officer, setOfficer] = useState();


    useEffect(() => {
        // Fetch officer data 
        getOfficer(id);
    }, [id]);



    // Asynchronously fetch officer data 
    const getOfficer = async (id) => {
        try {
            const data = await OfficerDataService.getAllOfiicer();

            // Transform QueryDocumentSnapshot objects into plain JavaScript objects
            const officers = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const officerData = officers.find(officer => officer.id === id);

            if (officerData) {
                setOfficer(officerData);
            } else {
                setOfficer(null);
            }
        } catch (error) {
            console.error("Error fetching officer data:", error);
            setOfficer(null);
        }
    };




    return (
        <div className="single">
            <Sidebar/>
            <div className="signleContainer">
                <Navbar />
                <div className="top">
                    <div className="left" >



                        <h1 className="title">Information</h1>


                        <div className="item">
                            <img
                                src={officer?.imageUpload}
                                alt=""
                                className="itemImg" />


                            <div className="details">
                                <h1 className="itemTitle">{officer?.fname}</h1>

                                <div className="detailItem">
                                    <span className="itemKey">Position: </span>
                                    <span className="itemValue">{officer?.position}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Department: </span>
                                    <span className="itemValue">{officer?.department}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Email: </span>
                                    <span className="itemValue">{officer?.email}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">NIC: </span>
                                    <span className="itemValue">{officer?.nic}</span>
                                </div>


                                <div className="detailItem">
                                    <span className="itemKey">PID: </span>
                                    <span className="itemValue">{officer?.pid}</span>
                                </div>

                            
                                <div className="detailItem">
                                    <span className="itemKey">Phone: </span>
                                    <span className="itemValue">{officer?.phone}</span>
                                </div>





                            </div>
                        </div>
                    </div>

                    <div className="right">
                        <Chart aspect={3 / 1} title="Complain Analysis Based on Categories" />
                    </div>
                </div>


                <div className="bottom">
                    <h1 className="title">Police Officer List</h1>
                    <Datatable />
                </div>

            </div>
        </div>
    );
};
export default Single; 