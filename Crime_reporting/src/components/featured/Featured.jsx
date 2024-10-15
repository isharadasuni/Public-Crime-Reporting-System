import "./featured.scss"
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import React, { useEffect, useState } from "react";
import ManualReportDataService from "../../services/manualReport.services";
import MobileReportDataService from "../../services/mobileCrime.serivices";

//library for the charts svg using

// success rates 

const Featured = () => {


    const [totalManualReport, setTotalManualRepor] = useState();
    const [totalMobileReport, setTotalMobileRepor] = useState();
    const [totalAcceptManualReport, setTotalAcceptManualRepor] = useState();
    const [totalAcceptMobileReport, setTotalAcceptMobileRepor] = useState();
    const [totalRejectManualReport, setTotalRejectManualRepor] = useState();
    const [totalRejectMobileReport, setTotalRejectMobileRepor] = useState();

  
    const SuccessRate = async () => {
  
        try {
            
         //get total of manual report
         const manualReportSnapshot = await ManualReportDataService.getAllManualReport();
         const manualReportDocs = manualReportSnapshot.docs;
         const sumOfManualReports = manualReportDocs.length;
         setTotalManualRepor(sumOfManualReports);
         //get total of manual accept
         const acceptReports = manualReportDocs.filter((doc) => doc.data().Status === "Accepted");
         const accept = acceptReports.length;
         setTotalAcceptManualRepor(accept);
         //get total of manual reject
         const rejectReports = manualReportDocs.filter((doc) => doc.data().Status === "Reject");
         const reject = rejectReports.length;
         setTotalRejectManualRepor(reject);


          //get total of mobile report
          const mobileReportSnapshot = await MobileReportDataService.getAllMobileReport();
          const mobileReportDocs = mobileReportSnapshot.docs;
          const sumOfMobileReports = mobileReportDocs.length;
          setTotalMobileRepor(sumOfMobileReports);
            //get total of mobile accepted 
            const acceptMobileReports = mobileReportDocs.filter((doc) => doc.data().Status === "Accepted");
            const acceptMobile = acceptMobileReports.length;
            setTotalAcceptMobileRepor(acceptMobile);
            //get total of mobile reject
            const rejectMobileReports = mobileReportDocs.filter((doc) => doc.data().Status === "Reject");
            const rejectMobile = rejectMobileReports.length;
            setTotalRejectMobileRepor(rejectMobile);

  
  
  
        }
        catch (error) {
            throw error;
        }
  
    }
    useEffect(() => {
        SuccessRate();
    }, []);
  
    const successRate = ((totalAcceptManualReport +totalAcceptMobileReport) / 
    ((totalManualReport+totalMobileReport)-(totalRejectManualReport+totalRejectMobileReport)) * 100 || 0).toFixed(2);
  
  
   
  
  







    return (

        <div className="featured">
            <div className="top">
                <h1 className="title">Success Rate of the System</h1>
                <MoreVertSharpIcon fontSize="small" />
            </div>
            <div className="bottom">
                <div className="featuredChart ">
                    <CircularProgressbar className="frame" value={parseFloat(successRate)} text={`${parseFloat(successRate)}%`} strokeWidth={5} />
                </div>
                <p className="desc">The success rate indicates the percentage of complains that have been 
                successfully accepted. It is calculated by dividing the total number of accepted complains 
                (both manual and mobile) by the total number of complains submitted. That does not consider the rejected complains.</p>


                <p></p>
                <p></p>
                <p></p>
                <p></p>

                <p className="title">Total Complains</p>
                <p className="amount">{totalManualReport + totalMobileReport}</p>
               

            </div>
        </div>
    )
}
export default Featured;