import { db } from "../firebase";
//firebase methods 
import {
    collection,
    getDocs,
    getDoc,
    doc,
    addDoc
} from "firebase/firestore";

//reference for comment collection
const commentCollectionRef = collection(db, "status_comments");

class commentDataService {


    //create new location
    addNewComment= (newComment) =>{
        return addDoc(commentCollectionRef, newComment);
    };

    
    //get all comment details method
    getAllComment = () => {
        return getDocs(commentCollectionRef);
    };

    //get specific comment details method
    getComment = (id) => {
        const commentDocRef = doc(db, "status_comments", id);
        return getDoc(commentDocRef);
    };


}


const commentService = new commentDataService();

export default commentService;  