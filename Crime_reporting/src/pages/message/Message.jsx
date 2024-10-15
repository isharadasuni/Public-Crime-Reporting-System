import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../message/message.scss";
import { React, useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import OfficerDataService from "../../services/officer.services";
import MessageDataService from "../../services/message.services";
import { storage } from "../../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { NotificationContext } from "../../context/NotificationContext";


const Message = () => {

    const { setMessageCount } = useContext(NotificationContext);
    const [message, setMessage] = useState({ errors: false, msg: "" });
    const currentUser = JSON.parse(localStorage.getItem("authUser"));
    const [receiver, setReceiver] = useState();
    const time = new Date(new Date().toISOString()).toLocaleString();
    const [attachment, setAttachment] = useState(null);
    const [sender, setSender] = useState();
    const [Text, setText] = useState();
    const [ferchMessage, setFetchMessage] = useState([]);




    const initialValues = {

        receiver: "",
        Text: "",
        time,

    };







    // Function to fetch current user' details
    const fetchCurrentUser = async (email) => {
        const data = await OfficerDataService.getAllOfiicer();
        // Find the current user's officer data
        const currentUserOfficer = data.docs.find((doc) => doc.data().email === email);

    }

    //function to fetch the officer data
    const fetchReceiver = async () => {
        try {
            const data = await OfficerDataService.getAllOfiicer();
            const email = data.docs.map((doc) => doc.data().email);
            setReceiver(email);
        } catch (error) {
            console.error("Error fetching email:", error.message);
        }
    };






    useEffect(() => {
        // Fetch current user
        fetchCurrentUser(currentUser.email);
        //fetch Receiver
        fetchReceiver();
        
    }, [currentUser.email]);



    const onSubmit = async (values, { resetForm }) => {
        setMessage("");
        if (
            //check empty fields
            !values.receiver ||
            !values.Text

        ) {
            setMessage({ errors: true, msg: "All fields are mandatory!" });
            return;
        }

        try {
            // Upload file to Firebase Storage
            let attachmentURL = null;
            if (attachment) {
                const storageRef = ref(storage, `messageAttachments/${attachment.name}`);
                await uploadBytes(storageRef, attachment);
                attachmentURL = await getDownloadURL(storageRef);
            }

            const addNewMessage = {
                ...values,
                attachment: attachmentURL,
                sender: currentUser.email,

            };
            await MessageDataService.addMessage(addNewMessage);
            setMessageCount(prevCount => prevCount + 1);

            setMessage({ errors: false, msg: "Message Send successful!" });


        } catch (err) {
            setMessage({ errors: true, msg: err.message });
        }
        resetForm();
    };




    //initialvalues in hook formik 
    const formik = useFormik({
        initialValues,
        onSubmit,

    });


    // Function to fetch the message data
    const fetchMessage = async () => {
        try {
           
                const data = await MessageDataService.getAllMessage();
                const messageData = data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));

                // Filter messages based on receiver being the current user
                const filteredMessages = messageData.filter((msg) => msg.receiver === currentUser.email);

                setFetchMessage(filteredMessages);
            
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    //fetch message
    useEffect(() => {
        fetchMessage();
    }, []);


    // Function to download attachment
    const handleVideoDownload = (attachmentURL) => {
        const link = document.createElement('a');
        link.href = attachmentURL;
        link.download = 'video';
        link.click();
    };



    return (

        <div className="message">
            <Sidebar />
            <div className="messageContainer">
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



                <div className="topMessage">
                    <div className="addNewReport"> Share Information</div>
                </div>


                <div className="bottomMessage">

                    <form onSubmit={formik.handleSubmit} >

                        <div style={{ color: 'rgb(6, 19, 117)', fontWeight: 'bold', fontSize: '18px' }}>
                            <label htmlFor="reporter">New Message</label>
                        </div>
                        <div>
                            <span>&nbsp;</span>
                            <span>&nbsp;</span>
                        </div>



                        <div className="formInput">
                            <label htmlFor="sender">Sender</label>
                            <input type="text" id="sender" name="sender" value={currentUser.email} readOnly />
                        </div>


                        <div className="formInput">
                            <label htmlFor="receiver">To</label>

                            <select
                                id="receiver"
                                name="receiver"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.receiver}
                                required
                            >
                                <option value="">Select Email</option>{receiver &&
                                    receiver.map((emailItem) => (
                                        <option key={emailItem} value={emailItem}>
                                            {emailItem}
                                        </option>
                                    ))}

                            </select>
                            {formik.touched.receiver && formik.errors.receiver ? (<div className="error">{formik.errors.selectEmail}</div>) : null}

                        </div>


                        <div className="formInput">
                            <label htmlFor="Text">Text</label>
                            <input type="text" id="Text" name="Text"
                                onChange={formik.handleChange} value={formik.values.Text} required/>
                        </div>

                        <div className="formInput">
                            <label htmlFor="Attachment">Attachment</label>
                            <input type="file" id="Attachment" name="Attachment" style={{ border: 'none' }}
                                onChange={(e) => setAttachment(e.target.files[0])} required/>
                        </div>





                        <button className="subButton" type="submit">
                            Send
                        </button>


                    </form>

                </div>

                <hr />





                <div className="bottomMessage">


                    <span>&nbsp;</span>
                    <span>&nbsp;</span>

                    <Typography variant="h5" gutterBottom >
                        <div >Messages</div>
                    </Typography>

                    <div className="grid">
                        <Grid container spacing={4}>
                            {ferchMessage.map((msg) => (
                                <Grid key={msg.id} item xs={12} sm={6} md={4} lg={3}>
                                    <Card className="postCard" >
                                        <CardContent>

                                            <Typography variant="body2">
                                                <label>From: </label>
                                                {msg.sender}
                                            </Typography>

                                            <Typography variant="body2" component="div">
                                                <label>To: </label>
                                                {msg.receiver}
                                            </Typography>

                                            <Typography variant="body2">
                                                <label>Text: </label>
                                                {msg.Text}
                                            </Typography>


                                            <Typography variant="body2">
                                                <label>Date: </label>
                                                {msg.time}
                                            </Typography>


                                            <Typography variant="body2">
                                                {/* <label>File: </label> */}
                                                {/* Download attachment */}
                                                {msg.attachment && (
                                                    <button
                                                        className="downloadBtn"
                                                        onClick={() => handleVideoDownload(msg.attachment)}
                                                    >
                                                        Download Attachment
                                                    </button>
                                                )}
                                            </Typography>

                                          




                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </div>






             
            </div>
        </div>
    )
}
export default Message;