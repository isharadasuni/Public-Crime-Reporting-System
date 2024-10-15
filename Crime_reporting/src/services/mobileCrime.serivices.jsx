import { db } from "../firebase";
//firebase methods 
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "firebase/firestore";


//reference for manualReport collection
const mobileReportCollectionRef = collection(db, "crime_reports");

class MobileReportDataService{

   

    //update report
    updateMobileReport =(id, newMobileReport) =>{
        const mobileReportDoc = doc(db, "crime_reports", id);
        return updateDoc(mobileReportDoc, newMobileReport);
    };

    //delete report
    deleteMobileReport = (id) =>{
        const mobileReportDoc = doc(db,"crime_reports", id);
        return deleteDoc(mobileReportDoc);
    };


    //get all report
    getAllMobileReport = () => {
        return getDocs(mobileReportCollectionRef);
    };

    //get specific report
    getManualReport = (id)=>{
        const mobileReportDocRef = doc(db, "crime_reports", id);
        return getDoc(mobileReportDocRef);
    };


}

const mobileReportService = new MobileReportDataService();

export default mobileReportService;
