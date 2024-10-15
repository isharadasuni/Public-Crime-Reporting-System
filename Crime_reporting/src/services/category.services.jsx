import {db} from "../firebase";
import {
    collection, 
    getDocs, 
    getDoc,  
    addDoc,  
    updateDoc, 
    deleteDoc, 
    doc 
   }  from "firebase/firestore";

   //reference to category collectio
   const categoryCollectionRef = collection(db,"category");

   class CategoryDataService{

    //add category
    addCategory = (newCategory) =>{
        return addDoc(categoryCollectionRef, newCategory);
    };

    //delete category
    deleteCategory =(id)=>{
        const categoryDoc = doc(db, "category", id);
        return deleteDoc(categoryDoc);
    };

    getAllCategory = () =>{
        return getDocs(categoryCollectionRef);
    };

    getCategory= (id) => {
        const categoryDocRef = doc(db, "category", id);
        return getDoc(categoryDocRef);
    };


   }

   const categoryService = new CategoryDataService();

   export default categoryService;
