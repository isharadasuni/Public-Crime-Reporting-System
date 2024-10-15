import "./widget.scss";
import React, { useEffect, useState } from "react";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import CheckIcon from '@mui/icons-material/Check';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from "react-router-dom";
import OfficerDataService from "../../services/officer.services";
import { auth } from '../../firebase';
import ManualReportDataService from "../../services/manualReport.services";
import MobileReportDataService from "../../services/mobileCrime.serivices";

const Widget = ({ type }) => {

    let data;
    //temporary
    const amount = 0;
    const diff = 40;


    //------------------------------------------------start pending------------------------------------------------------------------------------------

    const [totalManualReport, setTotalManualRepor] = useState();
    const [totalMobileReport, setTotalMobileRepor] = useState();
    const [totalPendingManualReport, setTotalPendingManualRepor] = useState();
    const [totalPendingMobileReport, setTotalPendingMobileRepor] = useState();

    const pendingReports = async () => {

        try {
            const manualReportSnapshot = await ManualReportDataService.getAllManualReport();
            //get total of manual report
            const sumOfManualReports = manualReportSnapshot.size;
            setTotalManualRepor(sumOfManualReports);


            // Filter and get the pending reports
            const manualReport = await ManualReportDataService.getAllManualReport();
            const pendingReports = manualReport.docs.filter((doc) => doc.data().Status === "Pending");
            const pending = pendingReports.length;
            setTotalPendingManualRepor(pending);



            const mobileReportSnapshot = await MobileReportDataService.getAllMobileReport();
            //get total of mobile report
            const sumOfMobileReports = mobileReportSnapshot.size;
            setTotalMobileRepor(sumOfMobileReports);




            // Filter and get the pending mobile base reports
            const mobileReport = await MobileReportDataService.getAllMobileReport();
            const pendingMobileReports = mobileReport.docs.filter((doc) => doc.data().Status === "Pending");
            const pendingMobile = pendingMobileReports.length;
            setTotalPendingMobileRepor(pendingMobile);





        }
        catch (error) {
            throw error;
        }

    }
    useEffect(() => {
        pendingReports();
    }, []);

    const pendingRate = (((totalPendingManualReport +totalPendingMobileReport) / (totalManualReport+totalMobileReport)) * 100 || 0).toFixed(2);


    //positive, green color 40<       //negative, red color 40>
    const colorStylePending = {
        color: type === "pending" ? (pendingRate > 40 ? "red" : "green") : "black",
    };





    //------------------------------------------------end pending------------------------------------------------------------------------------------



    //------------------------------------------------start users------------------------------------------------------------------------------------

    const [loggedInUsersCount, setLoggedInUsersCount] = useState(0);
    const [totalUsersCount, setTotalUsersCount] = useState();


    const availableUsers = async () => {

        try {

            // Initialize a variable
            let currentLoggedInUsers = 0;

            // Get the count of currently logged users
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    //logged in
                    currentLoggedInUsers += 1;
                } else {
                    //logged out
                    currentLoggedInUsers = Math.max(0, currentLoggedInUsers - 1);
                }
                setLoggedInUsersCount(currentLoggedInUsers);
            });

            // Get the total count of users from your database
            const officerSnapshot = await OfficerDataService.getAllOfiicer();
            const sumOfUsers = officerSnapshot.size;
            setTotalUsersCount(sumOfUsers);

            // Cleanup the auth state listener when the component unmounts
            return () => {
                unsubscribe();
            };
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        availableUsers();
    }, []);

    // Available rate of the user
    const availableUserRate = ((loggedInUsersCount / totalUsersCount) * 100 ||0).toFixed(2);

    //positive, green color 30>      //negative, red color3 0<
    const colorStyleUsers = {
        color: type === "users" ? (availableUserRate < 30 ? "red" : "green") : "black",
    };


    //------------------------------------------------end users------------------------------------------------------------------------------------



  //------------------------------------------------start ACCEPTED CRIME REPORTS------------------------------------------------------------------------------------

 
  const [totalAcceptManualReport, setTotalAcceptManualRepor] = useState();
  const [totalAcceptMobileReport, setTotalAcceptMobileRepor] = useState();

  const acceptedReports = async () => {

      try {
          

          // Filter and get the ACCEPTED reports
          const manualReportAC = await ManualReportDataService.getAllManualReport();
          const acceptReports = manualReportAC.docs.filter((doc) => doc.data().Status === "Accepted");
          const accept = acceptReports.length;
          setTotalAcceptManualRepor(accept);




          // Filter and get the ACCEPTED mobile base reports
          const mobileReportAC = await MobileReportDataService.getAllMobileReport();
          const acceptMobileReports = mobileReportAC.docs.filter((doc) => doc.data().Status === "Accepted");
          const acceptMobile = acceptMobileReports.length;
          setTotalAcceptMobileRepor(acceptMobile);





      }
      catch (error) {
          throw error;
      }

  }
  useEffect(() => {
    acceptedReports();
  }, []);

  const acceptRate = (((totalAcceptManualReport +totalAcceptMobileReport) / (totalManualReport+totalMobileReport)) * 100 || 0).toFixed(2);


  //positive, green color 40<       //negative, red color 40>
  const colorStyleAccept = {
      color: type === "accepted" ? (acceptRate < 40 ? "red" : "green") : "black",
  };





  //------------------------------------------------end ACCESPTED CRIME REPORTS------------------------------------------------------------------------------------






  //------------------------------------------------start Reject CRIME REPORTS------------------------------------------------------------------------------------

 
  const [totalRejectManualReport, setTotalRejectManualRepor] = useState();
  const [totalRejectMobileReport, setTotalRejectMobileRepor] = useState();

  const RejectReports = async () => {

      try {
          

          // Filter and get the Reject reports
          const manualReportReject= await ManualReportDataService.getAllManualReport();
          const rejectReports = manualReportReject.docs.filter((doc) => doc.data().Status === "Reject");
          const reject = rejectReports.length;
          setTotalRejectManualRepor(reject);




          // Filter and get the Reject mobile base reports
          const mobileReportReject = await MobileReportDataService.getAllMobileReport();
          const rejectMobileReports = mobileReportReject.docs.filter((doc) => doc.data().Status === "Reject");
          const rejectMobile = rejectMobileReports.length;
          setTotalRejectMobileRepor(rejectMobile);





      }
      catch (error) {
          throw error;
      }

  }
  useEffect(() => {
    RejectReports();
  }, []);

  const rejectRate = (((totalRejectManualReport + totalRejectMobileReport) / (totalManualReport+totalMobileReport)) * 100 || 0).toFixed(2);


  //positive, green color 40<       //negative, red color 40>
  const colorStyleReject = {
      color: type === "rejected" ? (rejectRate > 80 ? "red" : "green") : "black",
  };





  //------------------------------------------------end Reject CRIME REPORTS------------------------------------------------------------------------------------










    //divide widgets--------------------------------------------------------------------------------------------------------------------------------- 
    switch (type) {
        case "rejected":
            data = {
                title: "REJECTED COMPLAIN ",
                link: "See all Complains ",
                to: "/mobileCrimeData",
                icon: (<SummarizeOutlinedIcon className="icon"
                    style={{
                        color: "rgb(6, 19, 117)",
                        backgroundColor: "rgba(6, 19, 117, 0.123)",

                    }} />)

            };

            break;

        case "accepted":
            data = {
                title: "ACCEPTED COMPLAIN  ",
                link: "See all COMPLAIN ",
                to: "/mobileCrimeData",
                icon: (<CheckIcon className="icon"
                    style={{
                        color: "rgb(6, 19, 117)",
                        backgroundColor: "rgba(6, 19, 117, 0.123)",

                    }} />)


            };
            break;

        case "pending":
            data = {
                title: "PENDING COMPLAIN ",
                link: "See all Complain ",
                to: "/mobileCrimeData",
                icon: (<AutorenewIcon className="icon" style={{
                    color: "rgb(6, 19, 117)",
                    backgroundColor: "rgba(6, 19, 117, 0.123)",

                }} />)


            };
            break;

        case "users":
            data = {
                title: "AVAILABLE OFFICERS",
                link: "See all officers ",
                to: "/officer",
                icon: (<AccountCircleIcon className="icon"
                    style={{
                        color: "rgb(6, 19, 117)",
                        backgroundColor: "rgba(6, 19, 117, 0.123)",

                    }} />)


            };
            break;
        default:
            break;
    }

    //------------------------------------------------------------------------------------------------------------------------------------------------

    return (
        <div className="widget">
            <div className="left">
                <span className="title">{data.title}</span>


                <span className="counter">
                    {type === "users" ? loggedInUsersCount : 
                    type === "pending" ? totalPendingManualReport + totalPendingMobileReport : 
                    type==="accepted" ? totalAcceptManualReport +totalAcceptMobileReport: 
                    type==="rejected" ? totalRejectManualReport + totalRejectMobileReport: 
                    amount}
                </span>

                <Link to={data.to} style={{ textDecoration: "none" }}>
                    <span className="link">{data.link}</span>
                </Link>

            </div>



            <div className="right">

                <div className="percentage" style={
                    type === "users" ? colorStyleUsers : 
                    type === "pending" ?colorStylePending:
                    type === "accepted" ?colorStyleAccept : 
                    type === "rejected" ?colorStyleReject :
                    null }>
                    <KeyboardArrowUpIcon />
                    {type === "users" ? `${availableUserRate}%` : 
                    type === "pending" ? `${pendingRate}%` :
                    type == "accepted" ? `${acceptRate}%`: 
                    type == "rejected" ? `${rejectRate}%`:
                    `${diff}%`}
                </div>

                <div className="icon">{data.icon}</div>

            </div>

        </div>
    )
}
export default Widget;
