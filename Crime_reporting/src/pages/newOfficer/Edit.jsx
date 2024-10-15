import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./edit.scss";
import OfficerDataService from "../../services/officer.services";
import React, { useEffect, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import PoliceLocationDataService from "../../services/policeStation.services";



//edit User profile



const storage = getStorage(); // Initialize Firebase Storage

const List = () => {


    const currentUser = JSON.parse(localStorage.getItem("authUser"));
    const [officer, setOfficer] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [message, setMessage] = useState({ errors: false, msg: "" });
    const [phoneError, setPhoneError] = useState("");
    const lastUpdate = new Date(new Date().toISOString()).toLocaleString();
    const [depart, setDepart] = useState();
    const [editedOfficer, setEditedOfficer] = useState({
        imageUpload: '',
        fname: '',
        position: '',
        department: '',
        phone: '',
    });



    useEffect(() => {
        currentUserImage(currentUser.email);
    }, [currentUser.email]);



    // Function to fetch current user's image
    const currentUserImage = async (email) => {
        try {
            const data = await OfficerDataService.getAllOfiicer();
            // Find the current user's officer data based on email
            const currentUser = data.docs.find((doc) => doc.data().email === email);
            if (currentUser) {
                // Get the image URL and name of the current user
                const user = {
                    id: currentUser.id, // Include the document ID
                    ...currentUser.data(),
                };
                setOfficer(user);
            }
        } catch (error) {
            console.error("Error fetching user image:", error);

        }
    }


    //edit mood
    const handleEditClick = () => {
        setIsEditMode(true);
        setEditedOfficer({
            imageUpload: officer.imageUpload || '',
            fname: officer.fname || '',
            position: officer.position || '',
            department: officer.department || '',
            phone: officer.phone || '',
        });
    };



    const handleImageSelection = (e) => {
        const file = e.target.files[0];
        setSelectedImageFile(file);
    };


    //upload new image
    const handleImageUpload = async (imageFile) => {
        try {
            const storageRef = ref(storage, `Police_Officer/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            const imageUrl = await getDownloadURL(storageRef);
            return imageUrl;
        } catch (error) {
            throw error;
        }
    };


    const validatePhoneNumber = (phone) => {
        const regex = /^(?:\d{3}[- ]?)?\d{3}[- ]?\d{4}$/;
        return regex.test(phone);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const isValidPhoneNumber = validatePhoneNumber(value);

        if (name === "phone") {
            setPhoneError(isValidPhoneNumber ? "" : "Please check the phone number");
        }

        setEditedOfficer((prevEditedOfficer) => ({
            ...prevEditedOfficer,
            [name]: value,
        }));
    };


    //update profile
    const handleSubmitClick = async () => {


        try {
            let imageUrl = officer.imageUpload; // Use existing image URL if no new image is selected
            if (selectedImageFile) {
                // If a new image is selected, upload it and get the URL
                imageUrl = await handleImageUpload(selectedImageFile);
            }

            // Create an updated officer object with edited details and new image URL

            if (officer.id) {

                await OfficerDataService.updateOfficer(officer.id, {
                    ...officer,
                    ...editedOfficer,
                    imageUpload: imageUrl,
                    lastUpdate,
                });


                // Update the top section preview with edited details
                setOfficer((prevOfficer) => ({
                    ...prevOfficer,
                    ...editedOfficer,
                    imageUpload: imageUrl,
                }));
            } else {
                console.error("Invalid officer ID");
            }

            setMessage({ errors: false, msg: "Profile updated successfully!" });
            // Exit edit mode
            setIsEditMode(false);
        } catch (err) {
            setMessage({ errors: true, msg: err.message });
        }
    };



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

useEffect(() => {

        // Fetch department
        fetchDepartment();
    }, []);





    return (
        <div className="edit">
            <Sidebar/>
            <div className="editContainer">
                <Navbar />
                <div className="top">
                    <div className="left" >


                        <div className="title">Profile</div>



                        <div className="item">
                            <img
                                src={officer?.imageUpload}
                                alt=""
                                className="image" />


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


                                <div className="editButton" onClick={handleEditClick}>Edit Profile</div>


                            </div>
                        </div>



                    </div>

                </div>



                <div className="bottom">

                    {/* alert msg */}
                    {message?.msg && (
                        <div className={`alert ${message.errors ? "alert-danger" : "alert-success"}`}>
                            {message.msg} &nbsp;
                            <button className="close" onClick={() => setMessage("")}>
                                <span>&times;</span>

                            </button>
                        </div>
                    )}

                    {isEditMode ? (

                        <div>

                            <div className="title">Edit Profile</div>

                            <hr />

                            <div className="subTitle">Profile Picture</div>

                            <div className="editItem">

                                <img
                                    src={selectedImageFile ? URL.createObjectURL(selectedImageFile) : officer?.imageUpload}
                                    alt=""
                                    className="editImage" />

                            </div>
                            <input type="file" accept="image/*" onChange={handleImageSelection} />

                            <hr />

                            <div className="subTitle">Personal details</div>


                            <div>
                                <label htmlFor="fname">Full Name</label>
                                <input type="text" name="fname" value={editedOfficer.fname} onChange={handleInputChange} />
                            </div>

                            <div>
                                <label htmlFor="position">Position</label>

                                <select
                                    id="position"
                                    name="position"
                                    value={editedOfficer.position} onChange={handleInputChange}
                                >
                                    <option value="">Select Position</option>
                                    <option value="Chief">Chief</option>
                                    <option value="Police_Officer">Police Officer</option>
                                    <option value="Police_Technician">Police Technician</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="department">Department </label>

                                <select
                                    id="department"
                                    name="department"
                                    value={editedOfficer.department} onChange={handleInputChange}
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
                            </div>

                            <div>
                                <label htmlFor="phone">Phone </label>
                                <input type="text" name="phone" value={editedOfficer.phone} onChange={handleInputChange} />
                                {phoneError && <div className="error">{phoneError}</div>}
                            </div>


                            <hr />


                            <div className="submitButton" onClick={handleSubmitClick}>Submit
                            </div>

                        </div>
                    ) : null}




                </div>
            </div>
        </div>
    )
}
export default List;