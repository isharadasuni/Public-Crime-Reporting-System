import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { React, useState, useEffect } from "react";
import { useFormik } from "formik";
import OfficerDataService from "../../services/officer.services";
import PoliceLocationDataService from "../../services/policeStation.services";
import { storage } from "../../firebase";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { useUserAuth } from "../../context/UserAuthContext";
import Image from "../../image/noImage.jpg";
import { selectClasses } from "@mui/material";
import emailjs from '@emailjs/browser';





// add new officer

const New = () => {


    const { signUp } = useUserAuth();
    const password = generateRandomPassword(8);
    const [message, setMessage] = useState({ errors: false, msg: "" });
    const [imageUpload, setImageUpload] = useState();
    const [depart, setDepart] = useState();

    const initialValues = {

        fname: "",
        position: "",
        nic: "",
        pid: "",
        phone: "",
        email: "",
        department: "",


    };


    const onSubmit = async (values, { resetForm }) => {
        console.log("Plain Password:", password);
      
        setMessage("");
        if (
            //check empty fields
            !values.fname ||
            !values.position ||
            !values.nic ||
            !values.pid ||
            !values.phone ||
            !values.email ||
            !values.department ||
            !imageUpload

        ) {
            setMessage({ errors: true, msg: "All fields are mandatory!" });
            return;
        }


        try {
            const imageRef = ref(storage, `Police_Officer/${imageUpload.name}`);
            await uploadBytes(imageRef, imageUpload);
            const imageUrl = await getDownloadURL(imageRef);

            // Add the image URL to the officer data
            const newOfficer = {
                ...values,
                // encryptedPassword: encryptedPassword,
                imageUpload: imageUrl, // Add the image URL to the officer data
            };
            //create user in firestore
            await signUp(values.email, password);



            try {
                // Check if the current user is the Chief
                const officer = await OfficerDataService.getAllOfiicer();
                const chiefOfficer = officer.docs.find((doc) => doc.data().position === "Chief");
                if (chiefOfficer) {
                    // Add new officer data to Firestore
                    await OfficerDataService.addOfficer(newOfficer);
               
               
                } else {
                    throw new Error("User is not authorized to sign up.");
                }
            } catch (error) {
                throw error;
            }
            setMessage({ errors: false, msg: "Registration successful!" });

            
        } catch (err) {
            setMessage({ errors: true, msg: err.message });
        }

        resetForm();
        setImageUpload(null);



        // send email (emailjs)
        const templateParams = {
            to_name: values.fname,
            to_email: values.email,
            password: password 
        };

        try {
            await emailjs.send('service_4eadol3', 'template_o9g5n29', templateParams, 'j7VTm0Kn0km7tJ60_');
         
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Failed to send email. Please check the console for details.");
        }

    };




    //form validation 
    const validate = async (values) => {
        let errors = {};
        const data = await OfficerDataService.getAllOfiicer();

        if (!(/^[0-9]{9}[VU]$/.test(values.nic) || /^[0-9]{12}$/.test(values.nic))) {
            values.nic = "";
            errors.nic = "Please check the NIC";
        } else {
            // Check if the NIC already exists in the database
            const isNicExists = data.docs.some((doc) => doc.data().nic === values.nic);
            if (isNicExists) {
                values.nic = "";
                errors.nic = "NIC already exists";
            }
        }


        if (!/^(?:\d{3}[- ]?)?\d{3}[- ]?\d{4}$/.test(values.phone)) {
            values.phone = "";
            errors.phone = "Please check the phone number";
        }
        if (!/^[P][0-9]{9}$/.test(values.pid)) {
            values.pid = "";
            errors.pid = "Please check the PID";
        }
        // Check if the PID already exists in the database
        const isNicExists = data.docs.some((doc) => doc.data().pid === values.pid);

        if (isNicExists) {
            values.pid = "";
            errors.pid = "PID already exists";
        }


        return errors;


    };

    //initialvalues in hook formik 
    const formik = useFormik({
        initialValues,
        validate,
        onSubmit,
    });


    // Generate a random password
    function generateRandomPassword(length) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

        return password;
    }



    useEffect(() => {

        // Fetch department
        fetchDepartment();
    }, []);


    //function to fetch the department data
    const fetchDepartment = async () => {
        try {
            const data = await PoliceLocationDataService.getAllLocation();
            const dep = data.docs.map((doc) => doc.data().depatment_Name);
            setDepart(dep);
        } catch (error) {
            console.error("Error fetching department:", error.message);
        }
    };


















    return (

        <div className="new">
            <Sidebar />

            <div className="newContainer">
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

                <div className="topp">
                    <div className="addNewOf"> Add New Officer</div>
                </div>

                <div className="bottom">

                    <div className="left">

                        <img
                            src={imageUpload ? URL.createObjectURL(imageUpload) :
                                Image}
                            alt="" />
                    </div>

                    <div className="right">

                        <form onSubmit={formik.handleSubmit}>

                            <div className="formInput">
                                <label htmlFor="imageUpload">
                                    Image : <DriveFolderUploadIcon className="icon" />
                                </label>
                                <input
                                    type="file"
                                    id="imageUpload"
                                    name="imageUpload"
                                    onChange={(e) => setImageUpload(e.target.files[0])}
                                    style={{ display: "none" }}
                                    onBlur={formik.handleBlur}

                                />
                                {formik.touched.file && formik.errors.file ? (
                                    <div className="error">{formik.errors.file}</div>
                                ) : null}
                            </div>



                            <div className="formInput">
                                <label htmlFor="fname">Full Name</label>
                                <input type="text" placeholder="Dasuni Senadheera" id="fname" name="fname"
                                    onChange={formik.handleChange} value={formik.values.fname} onBlur={formik.handleBlur} required/>
                                {formik.touched.fname && formik.errors.fname ? (<div className="error">{formik.errors.fname}</div>) : null}
                            </div>


                            <div className="formInput">
                                <label htmlFor="position">Position</label>
                                <select
                                    id="position"
                                    name="position"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.position}
                                    required
                                >
                                    <option value="">Select Position</option>
                                    <option value="Chief">Chief</option>
                                    <option value="Police_Officer">Police Officer</option>
                                    <option value="Police_Technician">Police Technician</option>
                                </select>
                                {formik.touched.position && formik.errors.position ? (<div className="error">{formik.errors.position}</div>) : null}
                            </div>


                            <div className="formInput">
                                <label htmlFor="department">Department</label>
                                <select
                                    id="department"
                                    name="department"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.department}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {depart &&
                                        depart.map((departmentItem, index) => (
                                            <option key={index} value={departmentItem}>
                                                {departmentItem}
                                            </option>
                                        ))}
                                </select>
                                {formik.touched.department && formik.errors.department ? (<div className="error">{formik.errors.department}</div>) : null}
                            </div>

                            <div className="formInput">
                                <label htmlFor="nic">NIC</label>
                                <input type="text" placeholder="979007775V" id="nic" name="nic"
                                    onChange={formik.handleChange} value={formik.values.nic} onBlur={formik.handleBlur} required/>
                                {formik.touched.nic && formik.errors.nic ? (<div className="error">{formik.errors.nic}</div>) : null}
                            </div>


                            <div className="formInput">
                                <label htmlFor="pid">PID</label>
                                <input type="text" placeholder="P123456789" id="pid" name="pid"
                                    onChange={formik.handleChange} value={formik.values.pid} onBlur={formik.handleBlur} required/>
                                {formik.touched.pid && formik.errors.pid ? (<div className="error">{formik.errors.pid}</div>) : null}
                            </div>


                            <div className="formInput">
                                <label htmlFor="phone">Phone</label>
                                <input type="text" placeholder="071 852 6651" id="phone" name="phone"
                                    onChange={formik.handleChange} value={formik.values.phone} onBlur={formik.handleBlur} required/>
                                {formik.touched.phone && formik.errors.phone ? (<div className="error">{formik.errors.phone}</div>) : null}
                            </div>


                            <div className="formInput">
                                <label htmlFor="email">Email</label>
                                <input type="email" placeholder="DasuniSenadheera@gmail.com" id="email" name="email"
                                    onChange={formik.handleChange} value={formik.values.email} onBlur={formik.handleBlur} required />
                                {formik.touched.email && formik.errors.email ? (<div className="error">{formik.errors.email}</div>) : null}
                            </div>


                            <div className="formInput">
                                <label htmlFor="password"  ></label>
                                <input type="password" id="password" name="password" readOnly hidden
                                    value={formik.values.password} />
                            </div>


                            <button type="submit">
                                Submit
                            </button>


                        </form>
                    </div>

                </div>

            </div>
        </div>

    )
}
export default New; 