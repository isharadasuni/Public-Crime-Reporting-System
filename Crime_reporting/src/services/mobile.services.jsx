import { db } from "../firebase";
//firebase methods 
import {
    collection,
    getDocs,
    getDoc,
    doc
} from "firebase/firestore";

//reference for mobile user collection
const mobileCollectionRef = collection(db, "mobile_users");

class mobileDataService {

    
    //get all user details method
    getAllUser = () => {
        return getDocs(mobileCollectionRef);
    };

    //get specific user details method
    getUser = (id) => {
        const mobileDocRef = doc(db, "mobile_users", id);
        return getDoc(mobileDocRef);
    };


}


const mobileService = new mobileDataService();

export default mobileService;  