import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useState, useEffect } from 'react';
import "../news/news.scss";
import feedbackDataService from "../../services/feedback.services";
import { Card, CardContent, Typography, Divider } from '@mui/material';
import "./feedback.scss";
import Rating from '@mui/material/Rating';

const Feedback = () => {
    const [feedback, setFeedback] = useState([]);

    // Function to fetch the data
    const fetchFeedback = async () => {
        try {
            const data = await feedbackDataService.getAllfeedback();
            const feedbackData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setFeedback(feedbackData);
        } catch (error) {
            console.error("Error fetching feedback:", error);
        }
    };

    useEffect(() => {
        // Fetch feedback data 
        fetchFeedback();
    }, []);

    return (
        <div className="fblist">
            <Sidebar />
            <div className="fbContainer">
                <Navbar />

                <Typography variant="h5" className="title">
                    Feedback
                </Typography>

                <div className="feedbackList">
                    {feedback.map((fb) => (
                        <Card key={fb.id} className="postCard">
                            <CardContent>
                                <Typography variant="body1" component="div">
                                    <label className="label">Feedback: </label>
                                    {fb.feedbackText}
                                </Typography>
                                <Divider className="divider" />
                                <Typography variant="body1" component="div">
                                    <label className="label">Creator: </label>
                                    {fb.userEmail}
                                </Typography>
                                <Divider className="divider" />
                                <Typography variant="body2">
                                    <label className="label">Date: </label>
                                    {fb.dateTime}
                                </Typography>

                        
                                <Divider className="divider" />
                                <Typography variant="body2">
                                    <label className="label">Rating: </label>
                                    <Rating value={fb.rating} readOnly /> {/* Display rating */}
                                </Typography>

                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Feedback;
