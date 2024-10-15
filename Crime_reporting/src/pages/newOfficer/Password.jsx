import React, { useState } from 'react';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./password.scss";

const Password = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ errors: false, msg: "" });
  const [isPassword, setIsPassword] = useState(false);
  const auth = getAuth();

  const handleUpdatePassword = () => {

    const user = auth.currentUser;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ errors: true, msg: "All fields are mandatory" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ errors: true, msg: "Passwords do not match" });
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    // Re-authenticate the user
    reauthenticateWithCredential(user, credential)
      .then(() => {
        // Re-authentication successful, update the password
        updatePassword(user, newPassword)
          .then(() => {
            // Password updated successfully
            setMessage({ errors: false, msg: "Password updated successfully!" });
            setIsPassword(true);
          })
          .catch(error => {
            setMessage({ errors: true, msg: "Failed to update password. Please try again." });
          });
      })
      .catch(error => {
        // Re-authentication failed, show error message
        setMessage({ errors: true, msg: "Invalid current password. Please try again." });
      });
  };



  return (

    <div className="password">
      <Sidebar />
      <div className="passContainer">
        <Navbar />
        <div className="topPassword">

          <div className="passTitle">
            Reset Password
          </div>


          {/* alert msg */}
          {message?.msg && (
            <div className={`alert ${message.errors ? "alert-danger" : "alert-success"}`}>
              {message.msg} &nbsp;
              <button className="close" onClick={() => setMessage("")}>
                <span>&times;</span>

              </button>
            </div>
          )}



          <form>

            <div className="topPass">
              <label>Current Password </label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required disabled={isPassword} />
            </div>


            <div>
              <label>New Password </label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required disabled={isPassword} />
            </div>


            <div>
              <label>Re-enter New Password </label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isPassword} />
              <label className="description">Your password must be 8 characters</label>
            </div>


            <div className={`resetButton ${isPassword ? 'disabled' : ''}`} onClick={handleUpdatePassword}>
              Reset
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}

export default Password;
