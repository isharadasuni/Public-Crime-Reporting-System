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
const fireStationLocationCollectionRef = collection(db, "fireStationLocation");

class FireStationLocationDataService{

 //create new location
 addlocation = (newLocation) => {
    return addDoc(fireStationLocationCollectionRef, newLocation);
 };

 //update location
 updateLocation = (id, newLocation) => {
    const locationDoc = doc(db, "fireStationLocation", id);
    return updateDoc(locationDoc, newLocation);
 };

 //delete location
 deleteLocation = (id) => {
    const locationDoc = doc(db, "fireStationLocation", id);
    return deleteDoc(locationDoc);
 };

//get all location details method
getAllLocation  = () => {
   return getDocs(fireStationLocationCollectionRef);
};



 //get location
 getLocation  = (id)=>{
    const locationDocRef = doc(db, "fireStationLocation", id);
    return getDoc(locationDocRef);
 };



}

const fireStationLocationService = new FireStationLocationDataService();

export default fireStationLocationService;