import{db} from "../firebase";
//methods
import{
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "firebase/firestore";


//reference to location collection
const hospitalLocationCollectionRef = collection(db, "hospitalLocation");

class HospitalLocationDataService{

 //create new location
 addlocation = (newLocation) => {
    return addDoc(hospitalLocationCollectionRef, newLocation);
 };

 //update location
 updateLocation = (id, newLocation) => {
    const locationDoc = doc(db, "hospitalLocation", id);
    return updateDoc(locationDoc, newLocation);
 };

 //delete location
 deleteLocation = (id) => {
    const locationDoc = doc(db, "hospitalLocation", id);
    return deleteDoc(locationDoc);
 };

//get all location details method
getAllLocation  = () => {
   return getDocs(hospitalLocationCollectionRef);
};



 //get location
 getLocation  = (id)=>{
    const locationDocRef = doc(db, "hospitalLocation", id);
    return getDoc(locationDocRef);
 };



}

const hospitalLocationService = new HospitalLocationDataService();

export default hospitalLocationService;