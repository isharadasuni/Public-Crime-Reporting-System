import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import MobileReportDataService from "../../services/mobileCrime.serivices";
import ManualReportDataService from "../../services/manualReport.services";
import mobileDataService from"../../services/mobile.services";
import { useEffect, useState } from "react";
import "../../pages/newOfficer/edit.scss";
import React from 'react';
import { useParams } from 'react-router-dom';
import OfficerDataService from "../../services/officer.services";
import { DataGrid } from '@mui/x-data-grid';
import commentDataService from "../../services/comment.services";
import { ReportSharp } from "@mui/icons-material";
import emailjs from '@emailjs/browser';

//manual crime report data full record view


const SingleReportData = () => {

    // Get the user ID from the URL parameter
    let { id } = useParams();
    const queryParam =  new URLSearchParams(window.location.search);
    const refId = queryParam.get('referringId');
    const [Report, setReport] = useState({});
    const [Status, setSelectedStatus] = useState('');
    const [message, setMessage] = useState({ errors: false, msg: "" });
    const lastUpdate = new Date(new Date().toISOString()).toLocaleString();
    const currentUser = JSON.parse(localStorage.getItem("authUser"));
    const [ID, setID] = useState();
    const [userDepartment, setUserDepartment] = useState();
    const [predictionResult, setPredictionResult] = useState("");
    const [error, setError] = useState("");
    const [rejectedReportCount, setRejectedReportCount] = useState(0);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState(refId ?? '');
    const [duplicatedReports, setDuplicatedReports] = useState([]);
    const [email, setEmail]=useState([]);




    useEffect(() => {
        // Fetch crime reports
        fetchMobilelCrimeReport(id);
        // Fetch current user
        fetchCurrentUser(currentUser.email);

    }, [id]);





    //function to fetch the crime reports
    const fetchMobilelCrimeReport = async (id) => {
        const data = await MobileReportDataService.getAllMobileReport();
        const mobileReport = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const Report = mobileReport.find(mobileReport => mobileReport.id === id);

        setReport(Report);

        if(Report?.Status){
            setSelectedStatus(Report?.Status || '');
        }else{
            if (refId){
                setSelectedStatus('Duplicate');  
            }
        }

        
       console.log('$ Status : ',Report?.Status);
    };



    // Function to handle status update
    const handleStatusUpdate = async () => {
        try {
            if (Report.id) {
                await MobileReportDataService.updateMobileReport(Report.id, {
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
                await commentDataService.addNewComment({
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
                to_email: Report.reporter,
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




            fetchMobilelCrimeReport(id);
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
    const fetchRejectedReportCount = async (nic) => {
        try {


            // Calculate the date 3 months ago from the current date
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

            // Fetch all manual reports within the last 3 months related to the user ID
            const manualReportData = await ManualReportDataService.getAllManualReport();
            const filteredManualReports = manualReportData.docs.filter(doc => {
                const createTime = new Date(doc.data().createTime);
                return createTime >= threeMonthsAgo && doc.data().userNIC === nic && doc.data().Status === 'Reject';
            });


            // Fetch all mobile reports within the last 3 months related to the user ID
            const mobileReportData = await MobileReportDataService.getAllMobileReport();
            const filteredMobileReports = mobileReportData.docs.filter(doc => {
                const date = new Date(doc.data().date);
                return date >= threeMonthsAgo && doc.data().nic === nic && doc.data().Status === 'Reject';
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
        if (Report.nic) {
            fetchRejectedReportCount(Report.nic);
        }
    }, [Report]);



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






    const fetchDuplicatedReports = async () => {
        try {
            //Within 30mins
            let createTime = new Date(Report.date);
            let newTime = new Date(createTime.getTime() + 30 * 60000);
            console.log(newTime);

            // Fetch all mobile reports
            const mobileReportData = await MobileReportDataService.getAllMobileReport();


            // Filter reports within the time range
            const filteredReports = mobileReportData.docs.filter(doc => {
                const reportTime = new Date(doc.data().date);
                return reportTime >= createTime && reportTime <= newTime;
            });
            console.log("Filtered reports:", filteredReports);
            
            const caseNos = filteredReports.map(report => report.data().caseNo).filter(caseNo => caseNo !== Report.caseNo);
            console.log("Case Nos of filtered reports:", caseNos);





            // Calculate crime location coordinates as a point
            const crimeLocationPoint = { latitude: Report.crimeLatitude, longitude: Report.crimeLongitude };
            console.log(crimeLocationPoint);

            // Define radius for proximity (2km)
            const proximityRadius = 2; // in kilometers

            // Filter case numbers based on proximity to crime location
            const caseNosWithinProximity = filteredReports.filter(doc => {
                const report = doc.data();
                const reportLocation = { latitude: report.crimeLatitude, longitude: report.crimeLongitude };

                // Calculate distance between crime location and report location
                const distance = calculateDistance(crimeLocationPoint, reportLocation);
                console.log(distance);

                // Check if distance is within proximity radius
                return distance <= proximityRadius && report.caseNo !== Report.caseNo;
          }).map(doc => ({
                caseNo: doc.data().caseNo,
                id: doc.id,
                description: doc.data().description
            }));

            console.log("Case numbers within proximity:", caseNosWithinProximity);
 

// Prepare data for similarity prediction

const mainDescription = Report.description; 
        const additionalDescriptions = caseNosWithinProximity.map(report => ({
            id: report.id,
            caseNo: report.caseNo,
            description: report.description
        }));



// Call the Flask API to get similarity predictions
const response = await fetch('http://localhost:8000/duplicate', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        main_text: mainDescription,
        additional_texts: additionalDescriptions.map(item => item.description)
   
    })
});


const similarReports = await response.json();
console.log("Similar reports:", similarReports);


// Map similarity results back to the original reports including their IDs
const similarReportsWithIds = similarReports.map((similarity, index) => ({
    ...similarity,
    caseNo: additionalDescriptions[index].caseNo,
    id: additionalDescriptions[index].id
}));

console.log("Similar reports with IDs:", similarReportsWithIds);



            setDuplicatedReports(similarReportsWithIds);
        } catch (error) {
            console.error('Error fetching or filtering reports:', error);
        }
    };



    

    useEffect(() => {
        fetchDuplicatedReports(); // Call when component mounts
    }, []);
    
    useEffect(() => {
        fetchDuplicatedReports(); // Call when 'Report' changes
    }, [Report]);


    // Function to calculate distance between two points (in kilometers)
    function calculateDistance(point1, point2) {
        const earthRadius = 6371; // Earth's radius in kilometers
        const dLat = degreesToRadians(point2.latitude - point1.latitude);
        const dLon = degreesToRadians(point2.longitude - point1.longitude);
        const lat1 = degreesToRadians(point1.latitude);
        const lat2 = degreesToRadians(point2.latitude);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadius * c;
    }

    // Function to convert degrees to radians
    function degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }






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

                        <div className="title">Mobile base Complain Details</div>


                        {duplicatedReports.length > 0 && (
                            <div>


                                Duplicated Reports Case Number
                                <ul>
                                    {duplicatedReports.map(report => (
                                        <li key={report.id}>
                                            <a href={`/mobileCrimeData/${report.id}?referringId=${Report?.caseNo}`} target="_blank" rel="noopener noreferrer">
                                                {report.caseNo}
                                            </a>
                                        </li>
                                    ))}
                                </ul>



                            </div>
                        )}


                        <div className="item">


                            <div className="details">
                                <h1 className="itemTitle" style={{ fontSize: '20px' }}>Mobile Base Report -  {Report?.caseNo} </h1>

                                <div className="detailItem">
                                    <span className="itemKey">Category: </span>
                                    <span className="itemValue">{Report?.category}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Description: </span>
                                    <span className="itemValue">{Report?.description}</span>
                                </div>


                                <div className="detailItem">
                                    <span className="itemKey">NIC: </span>
                                    <span className="itemValue">{Report?.nic}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Reporter: </span>
                                    <span className="itemValue">{Report?.reporter}</span>
                                </div>


                                <div className="detailItem">
                                    <span className="itemKey">Selected Department: </span>
                                    <span className="itemValue">{Report?.departmentName}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Time: </span>
                                    <span className="itemValue">{Report?.date}</span>
                                </div>

                                <div className="detailItem" style={{ maxWidth: '100px', maxHeight: '100px', overflow: 'hidden' }}>
                                    {/* Image */}
                                    {Report.image_url && <img src={Report.image_url} alt="Report Image" style={{ width: '100%', height: 'auto' }} />}
                                </div>


                                <div className="detailItem" style={{ width: '50%', maxHeight: '200px', overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
                                    {/* Video */}
                                    {Report.video_url && (
                                        <video controls style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}>
                                            <source src={Report.video_url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Crime Location: </span>
                                    <a
                                        className="itemValue"
                                        href={`https://www.google.com/maps?q=${Report.crimeLatitude},${Report.crimeLongitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Crime Location
                                    </a>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Reporter Location: </span>
                                    <a
                                        className="itemValue"
                                        href={`https://www.google.com/maps?q=${Report.latitude},${Report.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Reporter Location
                                    </a>
                                </div>

                                <hr />

                                <div className="detailItem">
                                    <span className="itemKey">Predicted Category: </span>
                                    <span className="itemValue">{Report?.predictedCategory}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Finalized Category:</span>
                                    <span className="itemValue">{Report?.finalizedCategory}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Responded Department: </span>
                                    <span className="itemValue">{Report?.responded_Department}</span>
                                </div>

                                <div className="detailItem">
                                    <span className="itemKey">Last Responded Time: </span>
                                    <span className="itemValue">{Report?.lastUpdate}</span>
                                </div>


                                {rejectedReportCount > 1  && (
                                    <div className="detailItem">
                                        <div className="notice">
                                            <span>⚠️ Warning: There have been {rejectedReportCount} reject reports associated with this
                                                reporter in the last 3 months. Please review the details thoroughly before notifying the
                                                relevant department. </span>
                                        </div>
                                    </div>
                                )}


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

                                        
                                        <textarea value={comment} onChange={(e) => setComment(e.target.value)}>  </textarea>


                                    </div>
                                    <div className="submitButton" onClick={handleStatusUpdate} >Update </div>

                                </div>


                                <DataGrid
                                    className="datagrid"
                                    rows={comments}

                                    columns={[
                                        { field: "caseNo", headerName: "Case", width: 160 },
                                        { field: "comment", headerName: "Comment", width: 350 },
                                        { field: "Status", headerName: "Status", width: 80 },
                                        { field: "lastUpdate", headerName: "Last Updated", width: 180  },
                                        { field: "responded_Officer", headerName: "Officer", width: 100 },
                                        { field: "responded_Department", headerName: "Department", width: 100 },
                                    ]}
                                    pageSize={9}
                                    rowsPerPageOptions={[9]}
                                    
                                />


                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </div>


    )
}
export default SingleReportData;