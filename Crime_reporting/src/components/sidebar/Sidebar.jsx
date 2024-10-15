import "./sidebar.scss";
import React, { useEffect, useState, useContext } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FeedIcon from '@mui/icons-material/Feed';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import FireTruckIcon from '@mui/icons-material/FireTruck';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PieChartIcon from '@mui/icons-material/PieChart';
import GroupIcon from '@mui/icons-material/Group';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import { Link , useLocation } from "react-router-dom";
import { DarkMoodeContext } from "../../context/darkMoodeContext";
import OfficerDataService from "../../services/officer.services";
import { NotificationContext } from "../../context/NotificationContext";
import MobileScreenShareIcon from '@mui/icons-material/MobileScreenShare';

const Sidebar = () => {

   
    //darkmood
    const { dispatch } = useContext(DarkMoodeContext);
   

    // Fetch officer data----------------------------------------------------------------------------------------------------------------- 
    const currentUser = JSON.parse(localStorage.getItem("authUser"));
    const [image, setImage] = useState([]);
    const [name, setName] = useState();

    useEffect(() => {
        currentUserImage(currentUser.email);
    }, []);


    // Function to fetch current user's image
    const currentUserImage = async (email) => {
        try {
            const data = await OfficerDataService.getAllOfiicer();
            // Find the current user's officer data based on email
            const currentUser = data.docs.find((doc) => doc.data().email === email);

            if (currentUser) {
                // Get the image URL and name of the current user
                const userImage = currentUser.data().imageUpload;
                const userName = currentUser.data().fname;
                // Set the image URL and name in the component state
                setImage(userImage);
                setName(userName);
            }
        } catch (error) {
            console.error("Error fetching user image:", error);
        }
    }



    // news count--------------------------------------------------------------------------------------------------
    const { newsCount, setNewsCount } = useContext(NotificationContext);
    
 
    // Function to handle resetting news count
    const handleResetNewsCount = () => {
        setNewsCount(0);
    }



    //manual report count
    const { manualReportcount, setManualReportcount } = useContext(NotificationContext);
    // Function to handle resetting report count
    const handleResetReport = () => {
        setManualReportcount(0);
    }


    // State for active tab
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.pathname);

    useEffect(() => {
        setActiveTab(location.pathname);
    }, [location.pathname]);



    return (
        <div className="sidebar">

            <div className="top" >
                <div className="item">

                    <Link to="/profile" style={{ textDecoration: "none" }}>
                        <img
                            src={image || "https://img.freepik.com/premium-vector/police-officer-avatar-icon-vector-illustration_230920-3192.jpg?w=2000"}
                            alt=""
                            className="avatar"
                        />
                    </Link>
                    <div className="profile" >{name}</div>

                </div>
            </div>

{/* 
            <hr /> */}

            <div className="center">
                <ul>
                    <p className="title">MAIN</p>
                    <li className={activeTab === "/home" ? "active" : ""}>
                        <Link to="/home" style={{ textDecoration: "none" }}>
                            <DashboardIcon className="icon" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                </ul>


                <ul>
                    <li className={activeTab === "/manualCrimeData" ? "active" : ""}>
                        <Link to="/manualCrimeData" style={{ textDecoration: "none" }} onClick={handleResetReport}>
                            <FeedIcon className="icon" />
                            {/* manual report */}
                            <span>Manual Complain <label style={{color:'red'}}>{ manualReportcount}</label></span>
                        </Link>
                    </li>
                </ul>

                <ul>
                    <li className={activeTab === "/mobileCrimeData" ? "active" : ""}>

                        <Link to="/mobileCrimeData" style={{ textDecoration: "none" }}>
                            <MobileScreenShareIcon className="icon" />
                            <span>Mobile Complain</span>
                        </Link>
                    </li>
                </ul>



                <ul>
                    <li className={activeTab === "/category" ? "active" : ""}>
                        <Link to="/category" style={{ textDecoration: "none" }}>
                            <LibraryAddIcon className="icon" />
                            <span>Crime Category</span>
                        </Link>
                    </li>
                </ul>

                <ul>
                    <li className={activeTab === "/policeStation" ? "active" : ""}>
                        <Link to="/policeStation" style={{ textDecoration: "none" }}>
                            <LocalPoliceIcon className="icon" />
                            <span>Police Station</span>
                        </Link>
                    </li>
                </ul>

                <ul>
                    <li className={activeTab === "/hospital" ? "active" : ""}>
                        <Link to="/hospital" style={{ textDecoration: "none" }}>
                            <MedicalInformationIcon className="icon" />
                            <span>Hospital</span>
                        </Link>
                    </li>
                </ul>
                <ul>
                    <li className={activeTab === "/fireStation" ? "active" : ""}>
                        <Link to="/fireStation" style={{ textDecoration: "none" }}>
                            <FireTruckIcon className="icon" />
                            <span>Fire Brigade</span>
                        </Link>
                    </li>
                </ul>

                <ul>
                    <li className={activeTab === "/news" ? "active" : ""}>
                        <Link to="/news" style={{ textDecoration: "none" }} onClick={handleResetNewsCount}>
                            <NewspaperIcon className="icon" />
                            <span>News <label style={{color:'red'}}>{newsCount}</label> </span>
                           
                        </Link>
                    </li>
                </ul>

                <hr />

                <ul>
                    <p className="title"> REPORTS</p>

                    <li className={activeTab === "/generalReports" ? "active" : ""}>
                        <Link to="/generalReports" style={{ textDecoration: "none" }}>
                            <AssessmentIcon className="icon" />
                            <span>General Report</span>
                        </Link>
                    </li>
                </ul>

            
                <hr />

                <ul>
                    <p className="title">USERS</p>
                    <li className={activeTab === "/mobileUser" ? "active" : ""}>
                        <Link to="/mobileUser" style={{ textDecoration: "none" }}>
                            <GroupIcon className="icon" />
                            <span>Mobile User</span>
                        </Link>
                    </li>
                </ul>
                <ul>
                    <li className={activeTab === "/officer" ? "active" : ""}>
                        <Link to="/officer" style={{ textDecoration: "none" }}>
                            <SwitchAccountIcon className="icon" />
                            <span>Police Officer</span>
                        </Link>
                    </li>
                </ul>
                <hr />
                <ul>
                    <li className={activeTab === "/feedback" ? "active" : ""}>
                        <Link to="/feedback" style={{ textDecoration: "none" }}>
                            <span>FeedBack</span>
                        </Link>
                    </li>
                </ul>
                <hr />
            </div>
            <div className="bottom">
                <div className="colorOption" onClick={() => dispatch({ type: "LIGHT" })}></div>
                <div className="colorOption" onClick={() => dispatch({ type: "DARK" })}></div>
            </div>
        </div>
    )
}
export default Sidebar