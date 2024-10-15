import React  from 'react';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {DarkMoodeContextProvider} from "./context/darkMoodeContext";
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <DarkMoodeContextProvider>
 <StrictMode>
    <App />
  </StrictMode>
  </DarkMoodeContextProvider>
 
);