import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useEffect, useState, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import MobileReportDataService from "../../services/mobileCrime.serivices";
import OfficerDataService from "../../services/officer.services";
import { Link } from "react-router-dom";
import { NotificationContext } from "../../context/NotificationContext";
import "../../components/OfficerDatatable/datatable.scss";
import "../crimeReport/manualCrimeData.scss";

const ReportData = () => {
    const [message, setMessage] = useState({ errors: false, msg: "" });
    const [mobileReport, setReport] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("authUser"));
    const [position, setPosition] = useState();
    const [officer, setOfficer] = useState([]);
    const { notificationCount, setNotificationCount } = useContext(NotificationContext);
    const [filter, setFilter] = useState("All");
    const [filteredReports, setFilteredReports] = useState([]);
    const [userDepartment, setUserDepartment] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        // Fetch report
        fetchMobileCrimeReport();
        // Fetch officer data
        getOfficer();
        // Fetch current user's position
        fetchCurrentUserPosition(currentUser.email);

        // Set up an interval to fetch updated data every 30 seconds
        const interval = setInterval(() => {
            fetchMobileCrimeReport();
            // Increment the notification count when new data is fetched
            setNotificationCount(prevCount => prevCount + 1);
        }, 30000); // 30 seconds

        // Clean up interval to avoid memory leaks
        return () => clearInterval(interval);
    }, [currentUser.email, setNotificationCount]);

    useEffect(() => {
        applyFilter(mobileReport, filter, statusFilter);
    }, [filter, statusFilter, mobileReport, userDepartment]);

    // Function to fetch the data
    const fetchMobileCrimeReport = async () => {
        const data = await MobileReportDataService.getAllMobileReport();
        const mobileReport = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));

        // Sort reports by date (assuming 'date' field is a Date object)
        mobileReport.sort((a, b) => new Date(b.date) - new Date(a.date));

        setReport(mobileReport);
        applyFilter(mobileReport, filter, statusFilter);
    };

    const deleteHandler = async (id) => {
        try {
            await MobileReportDataService.deleteMobileReport(id);
            fetchMobileCrimeReport();
            setMessage({ errors: false, msg: "Successfully Deleted mobile base Crime Report!" });
        } catch (err) {
            setMessage({ errors: true, msg: err.message });
        }
    };

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

            //department
            const userDepartment = currentUserOfficer.data().department;
            setUserDepartment(userDepartment);
            applyFilter(mobileReport, filter, statusFilter);
        }
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const applyFilter = (reports, departmentFilter, statusFilter) => {
        let filteredReports = reports;

        if (departmentFilter !== "All") {
            filteredReports = filteredReports.filter(report => report.departmentName === userDepartment);
        }

        if (statusFilter !== "All") {
            filteredReports = filteredReports.filter(report => report.Status === statusFilter);
        }

        setFilteredReports(filteredReports);
    };

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
                            <div>Mobile Base Complain</div>
                        </div>
                    </div>

                    <select className="selection" value={filter} onChange={handleFilterChange}>
                        <option value="All">All</option>
                        <option value="My Department">My Department</option>
                    </select>

                    <select className="selection" value={statusFilter} onChange={handleStatusFilterChange}>
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Duplicate">Duplicate</option>
                        <option value="Reject">Reject</option>
                    </select>

                    <DataGrid
                        className="datagrid"
                        rows={filteredReports}
                        columns={[
                            { field: "caseNo", headerName: "Report No", width: 160 },
                            { field: "finalizedCategory", headerName: "Category", width: 150 },
                            { field: "description", headerName: "Description", width: 150 },
                            { field: "date", headerName: "Date", width: 180 },
                            { field: "departmentName", headerName: "Selected Department", width: 200 },
                            {
                                field: "action",
                                headerName: "Action",
                                width: 210,
                                renderCell: (params) => (
                                    <div className="cellAction">
                                        <Link to={`/mobileCrimeData/${params.row.id}`} style={{ textDecoration: "none" }}>
                                            <div className="viewButton">View</div>
                                        </Link>
                                        {position === "Chief" && (
                                            <div className="deleteButton" onClick={() => deleteHandler(params.row.id)}>Delete</div>
                                        )}
                                        <div className={`status ${params.row.Status ? params.row.Status : 'Pending'}`}>
                                            {params.row.Status || 'Pending'}
                                        </div>
                                    </div>
                                ),
                            },
                        ]}
                        pageSize={9}
                        rowsPerPageOptions={[9]}
                        checkboxSelection
                    />
                </div>
            </div>
        </div>
    );
};

export default ReportData;
