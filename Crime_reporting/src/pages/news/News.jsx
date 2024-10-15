import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./news.scss";
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent, Typography, Grid } from '@mui/material';
import NewsDataService from "../../services/news.services";
import OfficerDataService from "../../services/officer.services";


//view of the news post (news wall)


const News = () => {


    const [news, setNews] = useState([]);
    const [officer, setOfficer] = useState([]);
    const [message, setMessage] = useState({ errors: false, msg: "" });


    // Asynchronously fetch news data 
    const getNews = async () => {
        const data = await NewsDataService.getAllNews();
        // Process the fetched data and add 'id' properties to each news post
        const processedNews = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));
        // Set news data to state
        setNews(processedNews);
    };

    useEffect(() => {
        // Fetch news data 
        getNews();

    }, []);




    // Function to fetch creator's image
    const getCreator = async (created_by) => {
        try {
            const data = await OfficerDataService.getAllOfiicer();
            // Find the creator by ID
            const creator = data.docs.find((doc) => doc.data().pid === created_by);
            if (creator) {
                const officerData = creator.data();
                // Extract and return the creator's details
                const creatorDetails = {
                    id: creator.id,
                    department:officerData.department,
                    name: officerData.fname,
                   
                };
                return creatorDetails;
            }
        } catch (error) {
            console.error("Error fetching creator details:", error);
        }
        return null;
    };

    useEffect(() => {
        // Fetch and associate creator details with each news post
        news.forEach(async (post) => {
            const creatorDetails = await getCreator(post.created_by);
            if (creatorDetails) {
                post.creatorDetails = creatorDetails; // Assign creator details to each post
                setNews((prevNews) => [...prevNews]); // Update state
            }
        });
    }, [news])







    //delete post function
    const handleDelete = async (id) => {
        try {

            // Delete thepost data from Firestore
            await NewsDataService.deleteNews(id);
            // Fetch updated post data
            getNews();
            setMessage({ errors: false, msg: "successfully deleted news post!" });
        }
        catch (err) {
            setMessage({ errors: true, msg: err.message });
        }
    }






    // Function to download videos
    const handleVideoDownload = (videoUrl) => {
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = 'video';
        link.click();
    };



    return (

        <div className="news">
            <Sidebar />
            <div className="newsContainer">
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



                <div className="topNews">

                    <div className="newsTitle">
                        News Post
                    </div>

                    <Link to="/news/newPost" style={{ textDecoration: "none" }} className="link">
                        Create
                    </Link>

                </div>



                <div className="bottom">

                    <Grid container spacing={3}>

                        {news.map((post) => (
                            <Grid key={post.id} item xs={12} >
                                <Card className="postCard">

                                    <CardContent>

                                        <Typography variant="h3" component="div">
                                            {post.title}
                                        </Typography>

                                       


                                        <Typography variant="h6" component="div" >


                                            {/* Displaying images */}
                                            {post.imageUploads && post.imageUploads.map((imageUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imageUrl}
                                                    alt={`Image ${index}`}
                                                    style={{ width: '25%', maxHeight: '100px', objectFit: 'cover' }}
                                                />
                                            ))}


                                            {/* Displaying videos */}
                                            {post.videoUpload && (
                                                <center>
                                                    <video width="50%" style={{ width: '50%', maxHeight: '200px', objectFit: 'cover' }}
                                                        controls>

                                                        <source src={post.videoUpload} type="video/mp4" />
                                                        Your browser does not support HTML video.
                                                    </video>
                                                </center>
                                            )}
                                        </Typography>

                                        <Typography variant="h6" >
                                            {post.description}
                                        </Typography>


                                        {/* Display creator's name and profile image */}
                                        {post.creatorDetails && (
                                            <div className="creator">
                                                <label>Created by: </label>
                                                {post.creatorDetails.name}

                                            </div>

                                            
                                        )}


                                        {post.creatorDetails && (
                                            <div className="creator">
                                                <label>Departmet: </label>
                                                {post.creatorDetails.department}

                                            </div>


                                        )}


                                        <Typography variant="body2" >
                                            {post.createDate}
                                        </Typography>



                                        {/* Buttons for settings */}
                                        <div className="settings">
                                           

                                            {/* Delete */}
                                            <button
                                                className="deleteBtn"
                                                onClick={() => handleDelete(post.id)}
                                            >
                                                Delete
                                            </button>



                                            {/* Download video */}
                                            {post.videoUpload && (
                                                <button
                                                    className="downloadBtn"
                                                    onClick={() => handleVideoDownload(post.videoUpload)}
                                                >
                                                    Download Video
                                                </button>
                                            )}
                                        </div>

                                    </CardContent>

                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </div>
        </div>
    )
}
export default News; 