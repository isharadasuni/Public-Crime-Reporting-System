import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./category.scss"
import { useEffect, useState } from "react";
import OfficerDataService from "../../services/officer.services";
import CategoryDataService from "../../services/category.services";
import ManualReportDataService from "../../services/manualReport.services";
import React from 'react';
import { Link } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';

const Category = () => {


    const [message, setMessage] = useState({ errors: false, msg: "" });
    const [officer, setOfficer] = useState([]);
    const [newCategory, setNewCategory] = useState();
    const [position, setPosition] = useState();
    const [isEditMode, setIsEditMode] = useState(false);
    const [cat, setCat] = useState([]);
    const lastUpdate = new Date(new Date().toISOString()).toLocaleString();
    const currentUser = JSON.parse(localStorage.getItem("authUser"));
    const [ID, setID] = useState();


    //add new category mood 
    const handleAdd = () => {
        setIsEditMode(true);

    };

    const handleSubmitClick = async (e) => {
        e.preventDefault();
        try {
            const addNewCategory = {
                category: newCategory,
                lastUpdate,
                Officer_PID: ID,
            };
            const categoryData = await CategoryDataService.getAllCategory();
            const isCategory = categoryData.docs.some((doc) => doc.data().category === newCategory);
            if (!isCategory) {
                // Create a new category object 
                await CategoryDataService.addCategory(addNewCategory);
                // Reset the form and show success message
                setNewCategory("");
                getCategory();
                setIsEditMode(false);
                setMessage({ errors: false, msg: "Category added successfully!" });
            } else {
                setMessage({ errors: true, msg: "Category already exists!" });
                setIsEditMode(false);
            }
        } catch (error) {
            console.error("Error adding category: ", error);
            setMessage({ errors: true, msg: "Error adding category. Please try again." });
            setNewCategory("");


        }
    };




    useEffect(() => {
        getCategory();
        // Fetch current user's position
        fetchCurrentUserPosition(currentUser.email);
    }, []);





    // Function to fetch current user's position
    const fetchCurrentUserPosition = async (email) => {
        const data = await OfficerDataService.getAllOfiicer();
        // Find the current user's officer data
        const currentUserOfficer = data.docs.find((doc) => doc.data().email === email);
        if (currentUserOfficer) {
            const userPosition = currentUserOfficer.data().position;
            setPosition(userPosition);
            const policeId = currentUserOfficer.data().pid;
            setID(policeId);
        }
    }


    // Asynchronously fetch category data
    const getCategory = async () => {
        const data = await CategoryDataService.getAllCategory();
        // Process the fetched data and add 'id' properties to each category
        const cat = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));
        // Set category data to state
        setCat(cat);
    };




    const deleteHandler = async (id, category) => {
        try {
            // Check if the category is associated with any manual report
            const data = await CategoryDataService.getAllCategory();
            const checkCategory = data.docs.find((doc) => doc.data().category === category);

            const reportData = await ManualReportDataService.getAllManualReport();
            const associatedReports = reportData.docs.filter((doc) => doc.data().selectCategory === category);

            if (!associatedReports.length) {
                // If no associated reports, proceed with deletion
                await CategoryDataService.deleteCategory(id);
                getCategory();
                setMessage({ errors: false, msg: "Category successfully deleted!" });
            } else {
                setMessage({ errors: true, msg: "Cannot delete category with associated reports!" });
            }
        } catch (err) {
            setMessage({ errors: true, msg: err.message });
        }
    };





    return (
        <div className="category">
            <Sidebar />
            <div className="categoryContainer">
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



                <div className="dataTableTitle">

                    <div className="addNew">

                        <div>Add New Category</div>


                        {(position === "Chief" || position === "Police_Technician") ? (
                            <Link onClick={handleAdd} style={{ textDecoration: "none" }} className="link">
                                Add New
                            </Link>
                        ) : null}


                    </div>
                </div>

                <div className="container">
                    <div className="datatable">


                        <DataGrid
                            className="datagrid"
                            rows={cat}
                            columns={[

                                // Define columns
                                { field: "category", headerName: "Category", width: 200, },
                                { field: "Officer_PID", headerName: "Create by", width: 120 },
                                { field: "lastUpdate", headerName: " Last Update", width: 175 },


                                ...(position === "Chief"
                                    ? [
                                        {
                                            field: "action",
                                            headerName: "Action",
                                            width: 200,
                                            renderCell: (params) => (
                                                <div className="cellAction">
                                                    <div
                                                        id="dButton"
                                                        className="deleteButton"
                                                        onClick={(e) => deleteHandler(params.row.id, params.row.category)}
                                                    >
                                                        Delete
                                                    </div>
                                                </div>
                                            ),
                                        },
                                    ]
                                    : []),

                            ]}
                            pageSize={9}
                            rowsPerPageOptions={[9]}
                            checkboxSelection
                            headerClassName="datagrid-headerName"
                        />







                    </div>

                    {isEditMode ? (

                        <form className="newCategory">

                            <div>
                                <label htmlFor="category">Category</label>
                            </div>

                            <div>
                                <input type="text" name="category"
                                    onChange={(e) => setNewCategory(e.target.value)} placeholder="Enter new category..." required />
                            </div>

                            <div className="submitButton" onClick={handleSubmitClick}>Submit
                            </div>

                        </form>

                    ) : null}




                </div>
            </div>
        </div>
    )
}
export default Category;