import { createContext, useReducer } from "react";
import DarkMoodReducer from "./darkMoodeReducer";
import React  from 'react';


const INIRIAL_STATE ={
    darkMoode: false,
};

export const DarkMoodeContext = createContext(INIRIAL_STATE);

export const DarkMoodeContextProvider =({children}) =>{
    const [state, dispatch] = useReducer(DarkMoodReducer, INIRIAL_STATE);

    return(
        <DarkMoodeContext.Provider value={{darkMoode: state.darkMoode, dispatch}}>
            {children}
        </DarkMoodeContext.Provider>
    );
};
