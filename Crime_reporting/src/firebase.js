
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// https://firebase.google.com/docs/web/setup#available-libraries

//  web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTVxnWz2Dyx-ZCWN7xX_Sgub8nniV8EWM",
  authDomain: "sample-a8683.firebaseapp.com",
  databaseURL: "https://sample-a8683-default-rtdb.firebaseio.com",
  projectId: "sample-a8683",
  storageBucket: "sample-a8683.appspot.com",
  messagingSenderId: "957175099204",
  appId: "1:957175099204:web:b7a6eb9906d26e185df111",
  measurementId: "G-E7NJRP4D1F"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

const auth = getAuth(app);

// Export the db and storage objects
export {db,storage, auth};