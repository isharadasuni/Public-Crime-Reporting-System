import { db } from "../firebase";
//firebase methods 
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    doc
} from "firebase/firestore";

//reference for message collection
const messageCollectionRef = collection(db, "message");

class MessageDataService {

    //add message method 
    addMessage = (newMessage) => {
        return addDoc(messageCollectionRef, newMessage);
    };


    //get all message details method
    getAllMessage = () => {
        return getDocs(messageCollectionRef);
    };

    //get specific message details method
    getMessage = (id) => {
        const messageDocRef = doc(db, "message", id);
        return getDoc(messageDocRef);
    };


}


const messageService = new MessageDataService();

export default messageService;  