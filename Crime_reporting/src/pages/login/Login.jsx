import { useNavigate } from "react-router-dom";
import "./login.scss";
import { React, useState } from 'react';
import { useUserAuth } from "../../context/UserAuthContext";
import { Link } from "react-router-dom";
import Log from "../../image/Logo.jpg";
import OfficerDataService from "../../services/officer.services";
// import { ReportGmailerrorred } from "@mui/icons-material";




//NEW1chief@gmail.com
//12345678


//chief
// isharadasuni2017+web1@gmail.com
//vran9u&+


//officer
// isharadasuni2017+web2@gmail.com
//Y)<TGrY(

//tech
//isharadasuni2017+web3@gmail.com
//2LF0fb>>


const Login = () => {

  const { logIn } = useUserAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
     
      // Check if the current user is the office
      const officer = await OfficerDataService.getAllOfiicer();
      const chiefOfficer = officer.docs.find((doc) => doc.data().position === "Chief");
      const policeOfficer = officer.docs.find((doc) => doc.data().position === "Police_Office");
      const PoliceTechnician = officer.docs.find((doc) => doc.data().position === "Police_Technician");
      if (chiefOfficer||policeOfficer||PoliceTechnician) {
      // Check if user is authenticated successfully
      await logIn(email, password);
      navigate('/home');
    } else {
      throw new Error("User is not authorized to sign up.");
  }
    }
    catch (err) {
      setError(err.message);
    
    }
  };




  return (

    <div className="login">

      <div className="login-container">

        <img src={Log} alt="" />

        <h1 className="title">Login Here</h1>


        <form onSubmit={handleSubmit} >

          <div className="item">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              required
            />
          </div>

          <div className="item">
            <label>Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
          </div>

          <div className="item">
            <button type="submit" >
              Login
            </button>
          </div>

        </form>

        <div className="link">
          <Link to="/forgetPassword" style={{ textDecoration: "none", color: "gray" }}>
            <span>forget password</span>
          </Link>
        </div>

        {error && <div className="error alert-danger">{error}</div>}

      </div>
    </div>
  );
};

export default Login;