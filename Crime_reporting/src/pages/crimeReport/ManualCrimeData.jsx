import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import ManualReportDataService from "../../services/manualReport.services";
import OfficerDataService from "../../services/officer.services";
import "./manualCrimeData.scss";
import { Link } from "react-router-dom";
import "../../components/OfficerDatatable/datatable.scss";

const ManualCrimeData = () => {
    const [message, setMessage] = useState({ errors: false, msg: "" });
    const [manualReport, setReport] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("authUser"));
    const [position, setPosition] = useState("");
    const [filter, setFilter] = useState("All");
    const [filteredReports, setFilteredReports] = useState([]);
    const [userDepartment, setUserDepartment] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        fetchManualCrimeReport();
        fetchCurrentUserPosition(currentUser.email);
    }, []);

    useEffect(() => {
        applyFilter(manualReport, filter, statusFilter);
    }, [filter, statusFilter, manualReport, userDepartment]);

    const fetchManualCrimeReport = async () => {
        const data = await ManualReportDataService.getAllManualReport();
        const manualReport = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));

        // Sort reports by date (assuming 'date' field is a Date object)
        manualReport.sort((a, b) => new Date(b.date) - new Date(a.date));

        setReport(manualReport);
        applyFilter(manualReport, filter, statusFilter);
    };

    const deleteHandler = async(id) => {
        try {
            await ManualReportDataService.deleteManualReport(id);
            fetchManualCrimeReport();
            setMessage({ errors: false, msg: "Successfully deleted manual crime report!" });
        } catch (err) {
            setMessage({ errors: true, msg: err.message });
        }
    };

    const fetchCurrentUserPosition = async (email) => {
        const data = await OfficerDataService.getAllOfiicer();
        const currentUserOfficer = data.docs.find((doc) => doc.data().email === email);
        if (currentUserOfficer) {
            const userPosition = currentUserOfficer.data().position;
            const userDepartment = currentUserOfficer.data().department;
            setPosition(userPosition);
            setUserDepartment(userDepartment);
            applyFilter(manualReport, filter, statusFilter);  
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
            filteredReports = filteredReports.filter(report => report.CreatedBy_Department === userDepartment);
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
                            <div>Manual Complain</div>
                            <Link to="/manualCrimeReport" style={{ textDecoration: "none" }} className="link">
                                Add New
                            </Link>
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
                            { field: "caseNo", headerName: "Case No", width: 120 },
                            { field: "finalizedCategory", headerName: "Category", width: 160 },
                            { field: "description", headerName: "Description", width: 120 },
                            { field: "createTime", headerName: "Date", width: 180 },
                            { field: "address", headerName: "Address", width: 120 },
                            { field: "CreatedBy_Department", headerName: "Department", width: 120 },
                            {
                                field: "action",
                                headerName: "Action",
                                width: 210,
                                renderCell: (params) => (
                                    <div className="cellAction">
                                        <Link to={`/manualCrimeData/${params.row.id}`} style={{ textDecoration: "none" }}>
                                            <div className="viewButton">View</div>
                                        </Link>
                                        {position === "Chief" && (
                                            <div className="deleteButton" onClick={() => deleteHandler(params.row.id)}>Delete</div>
                                        )}
                                        <div className={`status ${params.row.Status}`}>{params.row.Status}</div>
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

export default ManualCrimeData;
