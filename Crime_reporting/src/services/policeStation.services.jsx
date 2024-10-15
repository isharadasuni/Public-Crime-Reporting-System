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
const policeLocationCollectionRef = collection(db, "policeStationLocation");

class PoliceLocationDataService{

 //create new location
 addlocation = (newLocation) => {
    return addDoc(policeLocationCollectionRef, newLocation);
 };

 //update location
 updateLocation = (id, newLocation) => {
    const locationDoc = doc(db, "policeStationLocation", id);
    return updateDoc(locationDoc, newLocation);
 };

 //delete location
 deleteLocation = (id) => {
    const locationDoc = doc(db, "policeStationLocation", id);
    return deleteDoc(locationDoc);
 };

//get all location details method
getAllLocation  = () => {
   return getDocs(policeLocationCollectionRef);
};



 //get location
 getLocation  = (id)=>{
    const locationDocRef = doc(db, "policeStationLocation", id);
    return getDoc(locationDocRef);
 };



}

const locationService = new PoliceLocationDataService();

export default locationService;