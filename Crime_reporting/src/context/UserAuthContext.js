import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getAuth,
  deleteUser,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";



// Context API
const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);



  // Signup function-----------------------------------------------------------------------------------------------------------
  function signUp(email, password) {
    createUserWithEmailAndPassword(auth, email, password);
  }



  // Login function-----------------------------------------------------------------------------------------------------------
  async function logIn(email, password) {

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      // Store login details in local storage
      localStorage.setItem("authUser", JSON.stringify({ email, password }));
      return userCredential.user;
    } catch (error) {
      throw error;
    }
    setUser(email, password);
  }



  // Delete user-----------------------------------------------------------------------------------------------------------
  async function deleteUserData(email, password) {
    const user = auth.currentUser;

    const credential = EmailAuthProvider.credential(email, password);
    try {
      // Delete the user
      await deleteUser(user);
    } catch (error) {

      console.error("Error deleting user:", error);
    }
  }



  // Logout function-----------------------------------------------------------------------------------------------------------
  function logOut() {
    // Remove login details from local storage
    localStorage.removeItem("authUser");
    return signOut(auth);
  }






// ------------------------------------------------------------------------------------------------------------------------------------


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Check local storage for authentication details during initialization
    const currentUser = JSON.parse(localStorage.getItem("authUser"));
    if (currentUser) {
      const { email, password } = currentUser;
      logIn(email, password);
    }
    return () => {
      unsubscribe();
    };
  }, []);

  return <userAuthContext.Provider value={{ user, signUp, deleteUserData, logIn, logOut}}>{children}</userAuthContext.Provider>;
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
