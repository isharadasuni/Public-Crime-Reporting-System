import "./navbar.scss";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import { useUserAuth } from "../../context/UserAuthContext";
import { DarkMoodeContext } from "../../context/darkMoodeContext";
import { NotificationContext } from "../../context/NotificationContext";
import MobileReportDataService from "../../services/mobileCrime.serivices";




const Navbar = () => {

    const { isDarkMode, dispatch } = useContext(DarkMoodeContext);
    const [dropDownMenu, setDropDownMenu] = useState(false);
    const [latestReport, setLatestReport] = useState([]);
    const { user, logOut } = useUserAuth();
    const navigate = useNavigate();
    const { notificationCount, setNotificationCount } = useContext(NotificationContext);
    const { messageCount, setMessageCount } = useContext(NotificationContext);
    const [dropDownNotification, setDropDownNotification] = useState(false);



 // Logoutn-----------------------------------------------------------------------------------------------------------------

 const handleLogOut = async () => {
     try {
         await logOut();
         navigate("/");
     } catch (err) {
         console.log(err.message);
     }
 }



// Dropdown-----------------------------------------------------------------------------------------------------------------
const toggleDropDown = () => {
    setDropDownMenu(!dropDownMenu);
}



 // Load notification count from localStorage on component mount
 const toggleNotifications = () => {
    const updatedCount = dropDownNotification ? notificationCount + 1 : 0;
    setNotificationCount(updatedCount);
    // Save the updated count in localStorage
    localStorage.setItem('notificationCount', updatedCount);
    setDropDownNotification(!dropDownNotification);
};



    // Function to fetch the latest crime reports
    const fetchLatestCrimeReports = async () => {
        try {
            const data = await MobileReportDataService.getAllMobileReport();
            const reports = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
                checked: false,
            }));
            setLatestReport(reports);
        } catch (error) {
            console.error('Error fetching latest reports:', error.message);
        }
    };

    // Function to handle marking a report as read
    const handleReportCheck = (reportId) => {
        const updatedReports = latestReport.map((report) => {
            if (report.id === reportId) {
                return { ...report, checked: true };
            }
            return report;
        });
        setLatestReport(updatedReports);

        // Store the ID of the read report in localStorage
        const readReportIds = JSON.parse(localStorage.getItem('readReportIds')) || [];
        localStorage.setItem('readReportIds', JSON.stringify([...readReportIds, reportId]));
   
    };

    // Function to periodically fetch the latest crime reports
    useEffect(() => {
        const interval = setInterval(() => {
            fetchLatestCrimeReports();
        }, 10000); // Fetch every 10 seconds
        return () => clearInterval(interval);
    }, []);

    // Effect to update notification count based on the number of unread reports
    useEffect(() => {
        const readReportIds = JSON.parse(localStorage.getItem('readReportIds')) || [];
        const unreadReportsCount = latestReport.filter(report => !report.checked && !readReportIds.includes(report.id)).length;
        setNotificationCount(unreadReportsCount);
    }, [latestReport]);


    return (
        <div className="navbar">
            <div className="wrapper">


                <Link to="/home" style={{ textDecoration: "none" }}>
                    <div className="logo">
                        Sri Lanka Police
                    </div>
                </Link>



                <div className="items" >

                    {/* darkmood */}
                    <div className="item">
                        <div className="dark">
                            <DarkModeOutlinedIcon className="icon dark" onClick={() => dispatch({ type: isDarkMode ? "LIGHT" : "DARK" })} />
                        </div>
                    </div>


                    {/* message */}
                    <div className="item">
                        <div className="dropdown">
                            <Link to="/message" style={{ textDecoration: "none" }}>
                                <MailOutlineIcon className="icon" />
                                <div className="counter">{messageCount}</div>
                            </Link>
                        </div>
                    </div>


                    <div className="item">

                        {/* Toggle for Notifications */}

                        <div className={`dropdown ${dropDownNotification ? 'show' : ''}`}>
                            <NotificationsNoneOutlinedIcon className="icon" onClick={toggleNotifications} />
                            <div className="counter">{notificationCount}</div>

                            {/* Display Notifications Dropdown if dropDownNotification is true */}

                            {dropDownNotification && (
                                <div className="dropdown-content">
                                    {latestReport.length > 0 ? (
                                        latestReport.slice(0, 3).filter(report => !report.checked && !JSON.parse(localStorage.getItem('readReportIds') 
                                        || '[]').includes(report.id)).map((report) => (
                                            !report.checked && (

                                                <div key={report.id} className="notification">
                                                    <h4>New Crime Report</h4>
                                                    <p>Case Number: {report.caseNo}</p>
                                                    <p>Reporter: {report.reporter}</p>
                                                    <p>description: {report.description}</p>
                                                    <button onClick={() => handleReportCheck(report.id)}>Mark as Read</button>
                                                    <hr />
                                                </div>
                                            )
                                        ))
                                    ) : (
                                        <p>No new crime reports</p>
                                    )}
                                    <Link to="/mobileCrimeData">View all reports</Link> 
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="item">
                        <div className={`dropdown ${dropDownMenu ? 'show' : ''}`}>
                            <FormatListBulletedOutlinedIcon className="icon" onClick={toggleDropDown} />

                            {dropDownMenu && (
                                <div className="dropdown-content">
                                    <a href="manualCrimeReport">Create Manual Crime Report</a>
                                    <a href="profile">Profile</a>
                                    <a href="password">Reset Password</a>
                                    <a href="#" onClick={handleLogOut}>Log Out</a>
                                </div>
                            )}
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default Navbar;
