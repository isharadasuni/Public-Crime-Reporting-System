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


//reference to news collection
const newsCollectionRef = collection(db, "news");

class NewsDataService{

 //create new news
 addNews = (newNews) => {
    return addDoc(newsCollectionRef, newNews);
 };

 //update newspost
 updateNews = (id, newNews) => {
    const newsDoc = doc(db, "news", id);
    return updateDoc(newsDoc, newNews);
 };

 //delete newspost
 deleteNews = (id) => {
    const newsDoc = doc(db, "news", id);
    return deleteDoc(newsDoc);
 };

//get all new details method
getAllNews = () => {
   return getDocs(newsCollectionRef);
};



 //get newspost
 getNews = (id)=>{
    const newsDocRef = doc(db, "news", id);
    return getDoc(newsDocRef);
 };



}

const newsService = new NewsDataService();

export default newsService;