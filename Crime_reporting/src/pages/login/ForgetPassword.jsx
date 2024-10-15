import { React, useState } from 'react';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from "firebase/auth";
import './forgetPassword.scss';
import OfficerDataService from "../../services/officer.services";

const ForgetPassword = () => {


    const [message, setMessage] = useState({ errors: false, msg: "" });
    const [emailentered, setEmailentered] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);


    const sendMail = async () => {

        try {
            // Fetch officer data
            const officers = await OfficerDataService.getAllOfiicer();
            // Check if entered email exists in officer data
            const isEmailValid = officers.docs.some((doc) => doc.data().email === emailentered);

            if (isEmailValid) {
                //send email
                await sendPasswordResetEmail(auth, emailentered);
                setMessage({ errors: false, msg: "Mail sent successfully!" });
                setIsEmailSent(true);
            } else {
                setMessage({ errors: true, msg: "Invalid email address. Please try again." });

            }
        } catch (err) {
            setMessage({ errors: true, msg: err.message });
            console.error("Error:", err);
           
        }
        setEmailentered(null);

    }



    return (

        <div className="forgetPassword">


            <div className="container">


                {/* alert msg */}
                {message?.msg && (
                    <div className={`alert ${message.errors ? "alert-danger" : "alert-success"}`}>
                        {message.msg} &nbsp;
                        <button className="close" onClick={() => setMessage("")}>
                            <span>&times;</span>

                        </button>
                    </div>
                )}

                <div className="forget-container">

                    <div className="fTitle">
                        Reset Your Password 
                    </div>
                    <hr />


                    <div className="description">
                        Please enter your email address you'd like your password reset information sent to
                    </div>


                    <div>
                        <input type="email" name="emailentered" id="emailentered"
                            onChange={(e) => setEmailentered(e.target.value)} placeholder="Enter Password" 
                            required disabled={isEmailSent} />
                    </div>
                    <hr />


                    <div className="display">
                        <a href="/">Cancel</a>
                        <div className={`countinue ${isEmailSent ? 'disabled' : ''}`} onClick={sendMail}>
                            Continue
                        </div>
                    </div>

                </div>

            </div>

        </div >

    )
}
export default ForgetPassword;