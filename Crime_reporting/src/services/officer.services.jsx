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

//reference for officer collection
const officerCollectionRef = collection(db, "officer");

class OfficerDataService {

    //add user method 
    addOfficer = (newOfficer) => {
        return addDoc(officerCollectionRef, newOfficer);
    };

    //update user method
    updateOfficer = (id, newOfficer) => {
        const officerDoc = doc(db, "officer", id);
        return updateDoc(officerDoc, newOfficer);
    };

    //delete user method
    deleteOfficer = (id) => {
        const officerDoc = doc(db, "officer", id);
        return deleteDoc(officerDoc);
    };

    //get all user details method
    getAllOfiicer = () => {
        return getDocs(officerCollectionRef);
    };

    //get specific user details method
    getOfficer = (id) => {
        const officerDocRef = doc(db, "officer", id);
        return getDoc(officerDocRef);
    };


}


const officerService = new OfficerDataService();

export default officerService;  