import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./newPost.scss";
import React, { useState, useEffect, useContext } from 'react';
import { useFormik } from "formik";
import { useUserAuth } from "../../context/UserAuthContext";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { storage } from "../../firebase";
import NewsDataService from "../../services/news.services";
import OfficerDataService from "../../services/officer.services";
import { NotificationContext } from "../../context/NotificationContext"

//creating news post

const NewPost = () => {

    const { signUp } = useUserAuth();
    const [message, setMessage] = useState({ errors: false, msg: "" });
    const [imageUploads, setImageUploads] = useState(Array(4).fill(null));
    const [videoUpload, setVideoUpload] = useState(null);
    const createDate = new Date(new Date().toISOString()).toLocaleString();
    const [ID, setID] = useState();
    const [dep, setDep] = useState();
    const currentUser = JSON.parse(localStorage.getItem("authUser"));
    const { setNewsCount } = useContext(NotificationContext);

    const initialValues = {

        title: "",
        description: "",
        createDate

    };


    const onSubmit = async (values, { resetForm }) => {

        setMessage({ errors: false, msg: "" });
        if (
            //check empty fields
            !values.title ||
            !values.description 
            

        ) {
            setMessage({ errors: true, msg: "All fields are mandatory!" });
            return;
        }


        try {
            const imageUrls = [];
            for (let i = 0; i < imageUploads.length; i++) {
                const image = imageUploads[i];
                if (image) {
                    const imageRef = ref(storage, `News_Img/${image.name}`);
                    await uploadBytes(imageRef, image);
                    const imageUrl = await getDownloadURL(imageRef);
                    imageUrls.push(imageUrl);
                }
            }

            // // Increment the news count using context
            setNewsCount(prevCount => prevCount + 1);



            let videoUrl = null;
            if (videoUpload) {
                const videoRef = ref(storage, `News_Video/${videoUpload.name}`);
                await uploadBytes(videoRef, videoUpload);
                videoUrl = await getDownloadURL(videoRef);
            }


            const newPost = {
                ...values,
                imageUploads: imageUrls,
                videoUpload: videoUrl,
                created_by:ID,
                Created_department:dep,


            };

            try {
                // Add new post to Firestore
                await NewsDataService.addNews(newPost);
                setMessage({ errors: false, msg: "Post Created successful!" });
      
            } catch (error) {
                throw error;
            }
             } catch (err) {
            setMessage({ errors: true, msg: err.message });
        }


        resetForm();
        setImageUploads(Array(4).fill(null));
        setVideoUpload(null);
    }



    //initialvalues in hook formik 
    const formik = useFormik({
        initialValues,
        onSubmit,
    });



    const handleImageUpload = (e, index) => {
        const newImages = [...imageUploads];
        newImages[index] = e.target.files[0];
        setImageUploads(newImages);
    };

    // Function to fetch current user' details
    const fetchCurrentUser = async (email) => {
        const data = await OfficerDataService.getAllOfiicer();
        // Find the current user's officer data
        const currentUserOfficer = data.docs.find((doc) => doc.data().email === email);
        if (currentUserOfficer) {
            const policeId = currentUserOfficer.data().pid;
            setID(policeId);
            const department = currentUserOfficer.data().department;
            setDep(department);
        }

       
    }

    useEffect(() => {
         // Fetch current user
         fetchCurrentUser(currentUser.email);
    }, []);






    


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
                    <div className="addNewOf"> Create News Post</div>
                </div>


                <div className="bottom">

                    <div className="left">
                        {/* Display uploaded images */}
                        {[...Array(4)].map((_, index) => (
                            <div className="formInput" key={index}>
                                <label htmlFor={`imageUpload${index}`}>
                                    <div className="previewContainer">
                                        <span>Image {index + 1}</span>
                                        {imageUploads[index] && (
                                            <img
                                                src={URL.createObjectURL(imageUploads[index])}
                                                alt={`Image ${index + 1}`}
                                                width="100"
                                                height="100"
                                            />
                                        )}
                                    </div>
                                    <DriveFolderUploadIcon className="icon" />
                                </label>
                                <input
                                    type="file"
                                    id={`imageUpload${index}`}
                                    name={`imageUpload${index}`}
                                    onChange={(e) => handleImageUpload(e, index)}
                                    style={{ display: "none" }}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        ))}

                        

                       


                    </div>

                    <div className="right">

                        <form onSubmit={formik.handleSubmit}>



                            {/* Display uploaded video */}
                            <div className="formInput">
                                <label htmlFor="videoUpload">
                                    <div className="previewContainer">
                                        <span>Video</span>
                                        {videoUpload && (
                                            <video controls width="200" height="200">
                                                <source src={URL.createObjectURL(videoUpload)} type="video/mp4" />
                                                Your browser does not support HTML video.
                                            </video>
                                        )}
                                    </div>
                                    <DriveFolderUploadIcon className="icon" />
                                </label>
                                <input
                                    type="file"
                                    id="videoUpload"
                                    name="videoUpload"
                                    onChange={(e) => setVideoUpload(e.target.files[0])}
                                    style={{ display: "none" }}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            <div className="formInput">
                                <label htmlFor="title">Title</label>
                                <input type="text" placeholder="Enter Titile " id="title" name="title"
                                    onChange={formik.handleChange} value={formik.values.title} onBlur={formik.handleBlur} required/>
                                {formik.touched.title && formik.errors.title ? (<div className="error">{formik.errors.title}</div>) : null}
                            </div>


                            <div className="formInput">
                                <label htmlFor="description">Description</label>
                                <textarea  placeholder="Type here..." id="description" name="description"
                                    onChange={formik.handleChange} value={formik.values.description} onBlur={formik.handleBlur} required/>
                                {formik.touched.description && formik.errors.description ? (<div className="error">{formik.errors.description}</div>) : null}
                            </div>


                            <div className="formInput">
                                <label htmlFor="createDate">Date</label>
                                <input type="createDate" id="createDate" name="createDate" readOnly
                                    onChange={formik.handleChange} value={formik.values.createDate} />
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
export default NewPost;