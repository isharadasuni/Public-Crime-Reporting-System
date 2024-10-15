import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/newOfficer/List";
import Single from "./pages/newOfficer/Single";
import New from "./pages/newOfficer/New";
import Edit from "./pages/newOfficer/Edit";
import Password from "./pages/newOfficer/Password";
import ForgetPassword from "./pages/login/ForgetPassword";
import Category from "./pages/category/Category";
import ManualCrimeReport from "./pages/crimeReport/ManualCrimeReport";
import ManualCrimeData from "./pages/crimeReport/ManualCrimeData";
import ManualCrimeSingle from "./pages/crimeReport/ManualCrimeSingle";
import PoliceStation from "./pages/maps/PoliceStation";
import News from "./pages/news/News";
import NewPost from "./pages/news/NewPost";
import AddPoliceStation from "./pages/maps/AddPoliceStation";
import Navbar from "./components/navbar/Navbar";
import { NotificationProvider } from "./context/NotificationContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./style/dark.scss";
import { React, useContext } from "react";
import { DarkMoodeContext } from "./context/darkMoodeContext";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import ProtectedRoute from "../src/ProtectedRoute";
import Hospital from "./pages/maps/Hospital";
import FireStation from "./pages/maps/FireStation";
import MobileUser from "./pages/mobileUser/MobileUser";
import AddHospital from "./pages/maps/AddHospital";
import AddFireStation from "./pages/maps/AddFireStation";
import ReportData from "./pages/mobileCrimeReports/ReportData";
import SingleReportData from "./pages/mobileCrimeReports/SingleReportData";
import GeneralReports from "./pages/generalReports/GeneralReport";
import Feedback from "./pages/feedback/Feedback";
import Message from "./pages/message/Message";





function App() {

  //darkmood
  const { darkMoode } = useContext(DarkMoodeContext);



  return (

    
   

    <div className={darkMoode ? "app dark" : "App"} >


      <NotificationProvider>




        <BrowserRouter>
          <UserAuthContextProvider>


            <Routes>

              <Route path="/" element={<Login />} />
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
              <Route path="/password" element={<ProtectedRoute><Password /></ProtectedRoute>} />
              <Route path="/forgetPassword" element={<ProtectedRoute><ForgetPassword /></ProtectedRoute>} />
              <Route path="/category" element={<ProtectedRoute><Category /></ProtectedRoute>} />
              <Route path="/manualCrimeReport" element={<ProtectedRoute><ManualCrimeReport /></ProtectedRoute>} />
             
              <Route path="/manualCrimeData">
                <Route index element={<ProtectedRoute><ManualCrimeData /></ProtectedRoute>} />
                <Route path="/manualCrimeData/:id" element={<ProtectedRoute><ManualCrimeSingle /></ProtectedRoute>} />
                <Route path="/manualCrimeData/profile" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
                <Route path="/manualCrimeData/password" element={<ProtectedRoute><Password /></ProtectedRoute>} />
                <Route path="/manualCrimeData/manualCrimeReport" element={<ProtectedRoute><ManualCrimeReport /></ProtectedRoute>} />
              </Route>


              <Route path="/mobileCrimeData">
                <Route index element={<ProtectedRoute><ReportData /></ProtectedRoute>} />
                <Route path="/mobileCrimeData/:id" element={<ProtectedRoute><SingleReportData /></ProtectedRoute>} />
                 <Route path="/mobileCrimeData/profile" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
                <Route path="/mobileCrimeData/password" element={<ProtectedRoute><Password /></ProtectedRoute>} />
                <Route path="/mobileCrimeData/manualCrimeReport" element={<ProtectedRoute><ManualCrimeReport /></ProtectedRoute>} />
                 </Route>
                 

              

              <Route path="/officer">
                <Route index element={<ProtectedRoute><List /></ProtectedRoute>} />
                <Route path="/officer/:id" element={<ProtectedRoute><Single /></ProtectedRoute>} />
                <Route path="/officer/profile" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
                <Route path="/officer/password" element={<ProtectedRoute><Password /></ProtectedRoute>} />
                <Route path="/officer/manualCrimeReport" element={<ProtectedRoute><ManualCrimeReport /></ProtectedRoute>} />
                <Route path="new" element={<ProtectedRoute><New /></ProtectedRoute>} />
              </Route>

              <Route path ="/news">
                <Route index element={<ProtectedRoute><News /></ProtectedRoute>} />
                <Route path="/news/profile" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
                <Route path="/news/password" element={<ProtectedRoute><Password /></ProtectedRoute>} />
                <Route path="/news/manualCrimeReport" element={<ProtectedRoute><ManualCrimeReport /></ProtectedRoute>} />
                <Route path="newPost" element={<ProtectedRoute><NewPost /></ProtectedRoute>} />
              </Route>


              <Route path="/policeStation">
                <Route index element={<ProtectedRoute><PoliceStation /></ProtectedRoute>} />
                <Route path="/policeStation/profile" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
                <Route path="/policeStation/password" element={<ProtectedRoute><Password /></ProtectedRoute>} />
                <Route path="/policeStation/manualCrimeReport" element={<ProtectedRoute><ManualCrimeReport /></ProtectedRoute>} />
                <Route path="addPoliceStation" element={<ProtectedRoute><AddPoliceStation /></ProtectedRoute>} />
              </Route>



              <Route path="/hospital">
                <Route index element={<ProtectedRoute><Hospital /></ProtectedRoute>} />
                <Route path="/hospital/profile" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
                <Route path="/hospital/password" element={<ProtectedRoute><Password /></ProtectedRoute>} />
                <Route path="/hospital/manualCrimeReport" element={<ProtectedRoute><ManualCrimeReport /></ProtectedRoute>} />
                <Route path="addHospital" element={<ProtectedRoute><AddHospital /></ProtectedRoute>} />
              </Route>


              <Route path="/fireStation">
                <Route index element={<ProtectedRoute><FireStation /></ProtectedRoute>} />
                <Route path="/fireStation/profile" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
                <Route path="/fireStation/password" element={<ProtectedRoute><Password /></ProtectedRoute>} />
                <Route path="/fireStation/manualCrimeReport" element={<ProtectedRoute><ManualCrimeReport /></ProtectedRoute>} />
                <Route path="addFireStation" element={<ProtectedRoute><AddFireStation /></ProtectedRoute>} />
              </Route>

              <Route path="/generalReports">
                <Route index element={<ProtectedRoute><GeneralReports /></ProtectedRoute>} />
                <Route path="/generalReports/profile" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
                <Route path="/generalReports/password" element={<ProtectedRoute><Password /></ProtectedRoute>} />
                <Route path="/generalReports/manualCrimeReport" element={<ProtectedRoute><ManualCrimeReport /></ProtectedRoute>} />
              </Route>


            


              <Route path="/mobileUser">
                <Route index element={<ProtectedRoute><MobileUser /></ProtectedRoute>} />
                <Route path="/mobileUser/profile" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
                <Route path="/mobileUser/password" element={<ProtectedRoute><Password /></ProtectedRoute>} />
                <Route path="/mobileUser/manualCrimeReport" element={<ProtectedRoute><ManualCrimeReport /></ProtectedRoute>} />
              </Route>


              
              <Route path="/feedback">
                <Route index element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
                <Route path="/feedback/profile" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
                <Route path="/feedback/password" element={<ProtectedRoute><Password /></ProtectedRoute>} />
                <Route path="/feedback/manualCrimeReport" element={<ProtectedRoute><ManualCrimeReport /></ProtectedRoute>} />
              </Route>

              <Route path="/message">
                <Route index element={<ProtectedRoute><Message /></ProtectedRoute>} />
                <Route path="/message/profile" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
                <Route path="/message/password" element={<ProtectedRoute><Password /></ProtectedRoute>} />
                <Route path="/message/manualCrimeReport" element={<ProtectedRoute><ManualCrimeReport /></ProtectedRoute>} />
              </Route>




            </Routes>
          </UserAuthContextProvider>
        </BrowserRouter>

      </NotificationProvider>
    </div>
  );
}

export default App;

