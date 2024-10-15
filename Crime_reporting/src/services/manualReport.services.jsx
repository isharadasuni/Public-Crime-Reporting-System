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
const manualReportCollectionRef = collection(db, "manualReport");

class ManualReportDataService{

    //create report
    addManualReport = (newManualReport)=>{
        return addDoc(manualReportCollectionRef, newManualReport);
    }; 

    //update report
    updateManualReport =(id, newManualReport) =>{
        const manualReportDoc = doc(db, "manualReport", id);
        return updateDoc(manualReportDoc, newManualReport);
    };

    //delete report
    deleteManualReport = (id) =>{
        const manualReportDoc = doc(db,"manualReport", id);
        return deleteDoc(manualReportDoc);
    };


    //get all report
    getAllManualReport = () => {
        return getDocs(manualReportCollectionRef);
    };

    //get specific report
    getManualReport = (id)=>{
        const manualReportDocRef = doc(db, "manualReport", id);
        return getDoc(manualReportDocRef);
    };


}

const manualReportService = new ManualReportDataService();

export default manualReportService;
