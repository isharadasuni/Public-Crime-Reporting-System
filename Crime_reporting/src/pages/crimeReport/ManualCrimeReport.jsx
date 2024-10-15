import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./manualCrimeReport.scss";
import { React, useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import OfficerDataService from "../../services/officer.services";
import ManualReportDataService from "../../services/manualReport.services";
import MobileUserDataService from "../../services/mobile.services"
import CategoryDataService from "../../services/category.services";
import { NotificationContext } from "../../context/NotificationContext";
import axios from "axios";
import HelpOutlineSharpIcon from '@mui/icons-material/HelpOutlineSharp';


// this crime report created by the police department in manualy




// Function to generate a unique case number
const generateCaseNumber = () => {
    const timestamp = Date.now();
    const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `MANUAL-${timestamp}-${randomChars}`;
};



const ManualCrimeReport = () => {

    const { setNotificationCount } = useContext(NotificationContext);
    const [message, setMessage] = useState({ errors: false, msg: "" });
    const createTime = new Date(new Date().toISOString()).toLocaleString();
    const currentUser = JSON.parse(localStorage.getItem("authUser"));
    const [ID, setID] = useState();
    const [category, setCategory] = useState();
    const [userDepartment, setUserDepartment] = useState();
    const [predictionResult, setPredictionResult] = useState("");
    const [error, setError] = useState("");
    const [showNextButton, setShowNextButton] = useState(true);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const { setManualReportcount } = useContext(NotificationContext);


    
    const initialValues = {
        caseNo: generateCaseNumber(),
        userNIC: "",
        selectCategory: "",
        reporter: "",
        email: "",
        phoneNo: "",
        address: "",
        description: "",
        createTime,
        Status: "Pending"

    };



    const onSubmit = async (values, { resetForm }) => {
        setMessage("");
        if (
            //check empty fields
            !values.userNIC ||
            !values.email||
            !values.reporter ||
            !values.selectCategory ||
            !values.phoneNo ||
            !values.address ||
            !values.description
        ) {
            setMessage({ errors: true, msg: "All fields are mandatory!" });
            return;
        }
        try {
            const addNewManualReport = {
                ...values,
                CreatedBy_PID: ID,
                CreatedBy_Department: userDepartment,
                predictCategory: predictionResult,
                finalizedCategory: selectedCategory || values.selectCategory,
            };
            await ManualReportDataService.addManualReport(addNewManualReport);

            setManualReportcount(prevCount => prevCount + 1); // Increment notification count


            setMessage({ errors: false, msg: "Report created successful!" });
        } catch (err) {
            setMessage({ errors: true, msg: err.message });
        }
        resetForm();
        setShowNextButton(true); // Show Next button again
        setShowSubmitButton(false); // Hide Submit button
        setPredictionResult(""); // Reset prediction result
        setSelectedCategory(""); // Reset selected category
        setError(""); // Reset error
    };



    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };



    const validate = async (values) => {
        let errors = {};
        if (!/^(?:\d{3}[- ]?)?\d{3}[- ]?\d{4}$/.test(values.phoneNo)) {
            values.phoneNo = "";
            errors.phoneNo = "Please check the phone number";
        }

        if (!(/^[0-9]{9}[VU]$/.test(values.userNIC) || /^[0-9]{12}$/.test(values.userNIC))) {
            values.userNIC = "";
            errors.userNIC = "Please check the NIC";
        }

        if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(values.email)){
            values.email = "";
            errors.email = "Please enter valid email";
        }

        if (!values.selectCategory) {
            errors.selectCategory = "*"
        }
        if (!values.reporter) {
            errors.reporter = "*"
        }
        if (!values.phoneNo) {
            errors.phoneNo = "*"
        }

        if (!values.address) {
            errors.address = "*"
        }
        if (!values.description) {
            errors.description = "*"
        }

        return errors;
    };


    //use prediction
    const predict = async (description) => {

        // Trim leading and trailing whitespace
        const trimmedDescription = description.trim();
        // Check if description is empty or only contains whitespace
        if (!trimmedDescription) {
            setError('Please provide a meaningful crime description');
            return;
        }
        const words = description.trim().split(/\s+/);
        if (words.length < 10) {
            setError('Crime description must contain at least 10 words');
            return;
        }
        // Check if the description contains significant criminal activity-related keywords
        const criminalKeywords = ["robbery", "burglary", "assault", "theft", "vandalism", "arson", "homicide", "kidnapping", "murder",
            "lost", "kill", "kidnap", "fight", "fraud", "stalking", "harassment","cybercrime","drug", "money","gun",""
           
        ];
        const containsCriminalActivity = criminalKeywords.some(keyword => trimmedDescription.toLowerCase().includes(keyword));
        if (!containsCriminalActivity) {
            setError('Please provide a description related to criminal activity');
            return;
        }

        // Check if the description contains meaningful content (no pure numeric sequences, icons, etc.)
        const meaningfulDescriptionRegex = /[^a-zA-Z0-9]/; 
        if (!meaningfulDescriptionRegex.test(trimmedDescription)) {
            setError('Please provide a description with meaningful content');
            return;
        }


        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/predict`, {
                text: description
            });
            setPredictionResult(response.data.prediction || "Unknown");
            setError(""); // Reset error state
            setShowNextButton(false);
            setShowSubmitButton(true);
        } catch (error) {
            setError('Error predicting crime category. Please try again.'); // Set error message
        }


    };






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
    useEffect(() => {
        // Fetch current user
        fetchCurrentUser(currentUser.email);
        // Fetch categories
        fetchCategory();
    }, []);



    //function to fetch the category data
    const fetchCategory = async () => {
        try {
            const data = await CategoryDataService.getAllCategory();
            const categories = data.docs.map((doc) => doc.data().category);
            setCategory(categories);
        } catch (error) {
            console.error("Error fetching categories:", error.message);
        }
    };



    //initialvalues in hook formik 
    const formik = useFormik({
        initialValues,
        validate,
        onSubmit,
        predict
    });


   

    
    return (

        <div className="crimeReport">
            <Sidebar />
            <div className="crimeContainer">
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



                <div className="topCrime">
                    <div className="addNewReport"> Add New Complain</div>
                </div>

                <div className="bottomCrime">

                    <form onSubmit={formik.handleSubmit}>


                        <div className="formInput">
                            <label htmlFor="caseNo">Case No</label>
                            <input type="text" id="caseNo" name="caseNo"
                                onChange={formik.handleChange} value={formik.values.caseNo} readOnly />
                        </div>


                        <div className="formInput">
                            <label htmlFor="selectCategory">Category</label>
                            <select
                                id="selectCategory"
                                name="selectCategory"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.selectCategory}
                                required
                            >
                                <option value="">Select Category</option>{category &&
                                    category.map((categoryItem) => (
                                        <option key={categoryItem} value={categoryItem}>
                                            {categoryItem}
                                        </option>
                                    ))}
                            </select>{formik.touched.selectCategory && formik.errors.selectCategory ? (<div className="error">{formik.errors.selectCategory}</div>) : null}



                        </div>

                        <div className="formInput">
                            <label htmlFor="userNIC">NIC</label>
                            <input type="text" placeholder="979087772V" id="userNIC" name="userNIC"
                                onChange={formik.handleChange} value={formik.values.userNIC} onBlur={formik.handleBlur} required />
                            {formik.touched.userNIC && formik.errors.userNIC ? (<div className="error">{formik.errors.userNIC}</div>) : null}
                        </div>


                        <div className="formInput">
                            <label htmlFor="reporter">Full Name</label>
                            <input type="text" placeholder="Dasuni Senadheera" id="reporter" name="reporter"
                                onChange={formik.handleChange} value={formik.values.reporter} onBlur={formik.handleBlur} required />
                            {formik.touched.reporter && formik.errors.reporter ? (<div className="error">{formik.errors.reporter}</div>) : null}
                        </div>

                        <div className="formInput">
                            <label htmlFor="email">Email</label>
                            <input type="email" placeholder="DasuniSenadheera@gmail.com" id="email" name="email"
                                onChange={formik.handleChange} value={formik.values.email} onBlur={formik.handleBlur} required />
                            {formik.touched.email && formik.errors.email ? (<div className="error">{formik.errors.email}</div>) : null}
                        </div>




                        <div className="formInput">
                            <label htmlFor="phoneNo">Phone Number</label>
                            <input type="text" placeholder="071 852 6651" id="phoneNo" name="phoneNo"
                                onChange={formik.handleChange} value={formik.values.phoneNo} onBlur={formik.handleBlur} required />
                            {formik.touched.phoneNo && formik.errors.phoneNo ? (<div className="error">{formik.errors.phoneNo}</div>) : null}
                        </div>


                        <div className="formInput">
                            <label htmlFor="address">Address</label>
                            <input type="text" placeholder="Kurunegala" id="address" name="address"
                                onChange={formik.handleChange} value={formik.values.address} onBlur={formik.handleBlur} required />
                            {formik.touched.address && formik.errors.address ? (<div className="error">{formik.errors.address}</div>) : null}
                        </div>

                        <div className="formInput">
                            <label htmlFor="description">Description</label>
                            <textarea type="text" placeholder="Type here..." id="description" name="description"
                                onChange={formik.handleChange} value={formik.values.description} onBlur={formik.handleBlur} >
                            </textarea>
                            {formik.touched.description && formik.errors.description ? (<div className="error">{formik.errors.description}</div>) : null}
                            {error && <div className="error">{error}</div>}
                        </div>




                        {predictionResult && predictionResult !== formik.values.selectCategory && (
                            <div >
                                <div   >
                                    <p className="predictionResult">
                                        <HelpOutlineSharpIcon />
                                        Hmm, after reviewing your description,
                                        it seems you selected the wrong category.
                                        Shall I suggest choosing “CATEGORY”?
                                        : <span className="color">{predictionResult}</span>
                                    </p>
                                </div>

                                <div className="radio" >
                                    <input
                                        className="formInput"
                                        type="radio"
                                        id="predictedCategory"
                                        name="predictedCategory"
                                        value={predictionResult}
                                        checked={selectedCategory === predictionResult}
                                        onChange={handleCategoryChange}
                                    />
                                    <label htmlFor="predictedCategory">{predictionResult}</label>
                                </div>

                                <div className="radio">
                                    <input
                                        className="formInput"
                                        type="radio"
                                        id="selectedCategory"
                                        name="selectedCategory"
                                        value={formik.values.selectCategory}
                                        checked={selectedCategory === formik.values.selectCategory}
                                        onChange={handleCategoryChange}
                                    />
                                    <label htmlFor="selectedCategory">{formik.values.selectCategory}</label>
                                </div>

                            </div>
                        )}




                        {showNextButton && (
                            <button type="button" onClick={() => predict(formik.values.description)}>Next</button>
                        )}




                        {showSubmitButton && (
                            <button type="submit">Submit</button>
                        )}




                    </form>




                </div>

            </div>
        </div>
    )
}
export default ManualCrimeReport;