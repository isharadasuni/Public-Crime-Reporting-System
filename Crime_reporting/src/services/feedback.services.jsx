import { db } from "../firebase";
//firebase methods 
import {
    collection,
    getDocs,
    getDoc,
    doc
} from "firebase/firestore";

//reference for  collection
const feedbackCollectionRef = collection(db, "feedback");

class feedbackDataService {

    
    //get all details method
    getAllfeedback = () => {
        return getDocs(feedbackCollectionRef);
    };

    //get specific  details method
    getFeedback = (id) => {
        const feedbackDocRef = doc(db, "feedback", id);
        return getDoc(feedbackDocRef);
    };


}


const feedbackService = new feedbackDataService();

export default feedbackService;  