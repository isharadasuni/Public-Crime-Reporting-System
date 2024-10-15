import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ManualReportDataService from "../../services/manualReport.services";
import MobileReportDataService from "../../services/mobileCrime.serivices";
import { useEffect, useState } from "react";
import "../../pages/newOfficer/edit.scss";
import React from 'react';
import { useParams } from 'react-router-dom';
import OfficerDataService from "../../services/officer.services";
import commentDataService from "../../services/comment.services";
import { DataGrid } from '@mui/x-data-grid';
import emailjs from '@emailjs/browser';

//manual crime report data full record view


const ManualCrimeSingle = () => {

    // Get the user ID from the URL parameter
    let { id } = useParams();
    const [Report, setReport] = useState({});
    const [Status, setSelectedStatus] = useState('');
    const [message, setMessage] = useState({ errors: false, msg: "" });
    const lastUpdate = new Date(new Date().toISOString()).toLocaleString();
    const currentUser = JSON.parse(localStorage.getItem("authUser"));
    const [ID, setID] = useState();
    const [userDepartment, setUserDepartment] = useState();
    const [predictionResult, setPredictionResult] = useState("");
    const [error, setError] = useState("");
    const [comment, setComment] = useState('');
    const [rejectedReportCount, setRejectedReportCount] = useState(0);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        // Fetch crime data
        fetchManualCrimeReport(id);
        // Fetch current user
        fetchCurrentUser(currentUser.email);
    }, [id]);





    //function to fetch the crime data
    const fetchManualCrimeReport = async (id) => {
        const data = await ManualReportDataService.getAllManualReport();
        const manualReport = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const Report = manualReport.find(manualReport => manualReport.id === id);

        setReport(Report);
        setSelectedStatus(Report?.Status || '');
    };



    // Function to handle status update
    const handleStatusUpdate = async () => {
        try {
            if (Report.id) {
                await ManualReportDataService.updateManualReport(Report.id, {
                    Status,
                    lastUpdate,
                    responded_Officer: ID,
                    responded_Department: userDepartment,

                });
            } else {

                setMessage({ errors: false, msg: "Fail Update!" });
            }
            setMessage({ errors: false, msg: "Status updated successfully!" });


            // Add comment to the report
            if (comment.trim() !== "") {
                await commentDataService.addNewComment( {
                    caseNo: Report.caseNo,
                    Status,
                    comment,
                    lastUpdate,
                    responded_Officer: ID,
                    responded_Department: userDepartment,
                });
                setMessage({ errors: false, msg: "Comment added successfully!" });
                setComment(''); // Clear comment field after successful save
            } else {
                setMessage({ errors: true, msg: "Comment cannot be empty!" });
            }



                // send email (emailjs)
                const templateParams = {
                    caseNo: Report.caseNo,
                    to_email: Report.email,
                    status:Status,
                    comment:comment,
                    time:lastUpdate,
                    department:userDepartment
                };
                
            try {
                await emailjs.send('service_ymk9baa', 'template_k79iqwn', templateParams, 'j7VTm0Kn0km7tJ60_');

            } catch (error) {
                console.error("Error sending email:", error);
                alert("Failed to send email. Please check the console for details.");
            }

            fetchManualCrimeReport(id);
            fetchCommentData();
        } catch (err) {


            setMessage({ errors: true, msg: err.message });
        }
    }



    // Function to fetch current user' details
    const fetchCurrentUser = async (email) => {
        const data = await OfficerDataService.getAllOfiicer();
        // Find the current user's officer data
        const currentUserOfficer = data.docs.find((doc) => doc.data().email === email);
        if (currentUserOfficer) {
            const userDepartment = currentUserOfficer.data().department;
            setUserDepartment(userDepartment);
            const policeId = currentUserOfficer.data().pid;
            setID(policeId);
        }
    }



    //fetch reject reports
    const fetchRejectedReportCount = async (userNIC) => {
        try {

            // Calculate the date 3 months ago from the current date
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

            // Fetch all manual reports within the last 3 months related to the user ID
            const manualReportData = await ManualReportDataService.getAllManualReport();
            const filteredManualReports = manualReportData.docs.filter(doc => {
                const createTime = new Date(doc.data().createTime);
                return createTime >= threeMonthsAgo && doc.data().userNIC === userNIC && doc.data().Status === 'Reject';
            });


            // Fetch all mobile reports within the last 3 months related to the user ID
            const mobileReportData = await MobileReportDataService.getAllMobileReport();
            const filteredMobileReports = mobileReportData.docs.filter(doc => {
                const date = new Date(doc.data().date);
                return date >= threeMonthsAgo && doc.data().nic === userNIC && doc.data().Status === 'Reject';
            });

            // Calculate the total count of rejected reports
            const totalRejectedReportCount = filteredManualReports.length + filteredMobileReports.length;


            // Set the count in state
         
            setRejectedReportCount(totalRejectedReportCount);



        } catch (error) {
            console.error("Error fetching rejected report count:", error.message);
        }
    }

    useEffect(() => {
        if (Report.userNIC ) {
            fetchRejectedReportCount(Report.userNIC);
        }
    }, [Report]);


   

    const handleUpdate = () => {
        handleStatusUpdate();
       
    };


    // Function to fetch comment details
    const fetchCommentData = async (caseNo) => {
        try {
            const data = await commentDataService.getAllComment();
            const comments = data.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(comment => comment.caseNo === caseNo);

            return comments;
        } catch (error) {
            console.error("Error fetching comments:", error.message);
            return [];
        }
    };
  
    useEffect(() => {
        const fetchData = async () => {
            const commentsData = await fetchCommentData(Report.caseNo);
            setComments(commentsData);
        };
        fetchData();
    }, [Report]);
    

    return (

        <div className="edit">

            <Sidebar />

            <div className="editContainer">

                <Navbar />


                {/* alert msg */}
                {message?.msg && (
                    <div className={`alert ${message.errors ? "alert-danger" : "alert-success"}`}>
                        {message.msg} &nbsp;
                        <button className="close" onClick={() => setMessage("")}>
                            <span>&times;</span>

                        </button>
                    </div>
                )}


                <div className="top">

                    <div className="left" >

                        <div className="title">Manual Complain Details</div>


                        <div className="item">


                            <div className="details">
                                <h1 className="itemTitle" style={{ fontSize: '20px' }}>Manual Report -  {Report?.caseNo} </h1>

                                <div className="detailItem">
                                    <span className="itemKey">Category: </span>
                                    <span className="itemValue">{Report?.selectCategory}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Description: </span>
                                    <span className="itemValue">{Report?.description}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">NIC: </span>
                                    <span className="itemValue">{Report?.userNIC}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Reporter: </span>
                                    <span className="itemValue">{Report?.reporter}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Phone No: </span>
                                    <span className="itemValue">{Report?.phoneNo}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Address: </span>
                                    <span className="itemValue">{Report?.address}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Created by: </span>
                                    <span className="itemValue">{Report?.CreatedBy_PID}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Created Department: </span>
                                    <span className="itemValue">{Report?.CreatedBy_Department}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Create Time: </span>
                                    <span className="itemValue">{Report?.createTime}</span>
                                </div>

                                <hr />

                                <div className="detailItem">
                                    <span className="itemKey">Predicted Category: </span>
                                    <span className="itemValue">{Report?.predictCategory}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Finalized Category: </span>
                                    <span className="itemValue">{Report?.finalizedCategory}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Responded by: </span>
                                    <span className="itemValue">{Report?.responded_Officer}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Responded Department: </span>
                                    <span className="itemValue">{Report?.responded_Department}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Last Responded Time: </span>
                                    <span className="itemValue">{Report?.lastUpdate}</span>
                                </div>

                                <div className="detailItem">
                                    {rejectedReportCount > 1 && (
                                        <div className="notice">
                                            <span>⚠️ Warning: There have been {rejectedReportCount} reject reports associated with this
                                                reporter in the last 3 months. Please review the details thoroughly before notifying the
                                                relevant department. </span>
                                        </div>
                                    )}
                                </div>


                                <hr />


                                <div className="bottom" style={{ margin: '50px  50px 50px 300px' }}>
                                    <div className="detailItem" >
                                        <span className="itemKey">Status: </span>
                                        <span className={`status ${Report?.Status}`}>{Report?.Status}</span>
                                        <select
                                            id="status"
                                            name="status"
                                            value={Status}

                                            onChange={(e) => { setSelectedStatus(e.target.value); }}
                                        >

                                            <option value="Pending">Pending</option>
                                            <option value="Accepted">Accepted</option>
                                            <option value="Reject">Reject</option>
                                            <option value="Duplicate">Duplicate</option>
                                        </select>

                                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
                               

                                    </div>
                                    <div className="submitButton" onClick={handleStatusUpdate}>Update</div>

                                </div>


                                <DataGrid
                                    className="datagrid"
                                    rows={comments}
                                  
                                    columns={[
                                        { field: "caseNo", headerName: "Case", width: 160 },
                                        { field: "comment", headerName: "Comment", width: 350 },
                                        { field: "Status", headerName: "Status", width: 80 },
                                        { field: "lastUpdate", headerName: "Last Updated", width: 180 },
                                        { field: "responded_Officer", headerName: "Officer", width: 100 },
                                        { field: "responded_Department", headerName: "Department", width: 100 },
                                    ]}
                                    pageSize={9}
                                    rowsPerPageOptions={[9]}
                                    checkboxSelection
                                />


                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </div>


    )
}
export default ManualCrimeSingle;