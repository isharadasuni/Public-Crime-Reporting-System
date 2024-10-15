
Public Crime Reporting System
ID Senadheera
------------------------------------------------------------

This repository contains the code and resources for the Public Crime Reporting System, a system designed to help the public report crimes easily and efficiently to law enforcement. This project includes a mobile app, web app, and machine learning models for crime category and duplicate prediction.

Table of Contents
- Requirements
- Project Setup
- Project Structure
- How to Run
- Firebase Database Setup
- Machine Learning Models
- Mobile App (Android)
- Web App (React)

***********************************************************
REQUIREMENTS

- React - Framework ^18.2.0
- NodeJs - v18.17.1
- Python - 3.11.2
- Flask - Framework 3.0.3
- Android Studio - Java - Android 5.0 (Lollipop)
- Firebase - Firestore Database
***********************************************************

PROJECT SETUP

1. Clone the repository:
   git clone https://github.com/your-username/PublicCrimeReportingSystem.git
2. Install dependencies:
   - For the web app: Navigate to the `Crime_reporting` folder and run `npm install`.
   - For the mobile app: Open the project in Android Studio and sync Gradle files.
   - For the ML models: Navigate to the respective Python model folders (`CategoryPredictionModel`, `DuplicatePredictionModel`) and install dependencies with `pip install -r requirements.txt`.

***********************************************************

PROJECT STRUCTURE

- CategoryPredictionModel: Python model to predict the category of crimes based on descriptions.
- DuplicatePredictionModel: Python model to predict duplicate crime reports.
- Crime_reporting: React-based web application for crime reporting.
- Mobile App: Android Studio project developed with Java for reporting crimes via mobile.
- firebase.js: Contains Firebase configuration for connecting to Firestore.

***********************************************************

HOW TO RUN

1. Web App (React):
   - Navigate to the `Crime_reporting` directory.
   - Run the development server: `npm start`.
   - Open `http://localhost:3000` in your browser.

2. Mobile App (Android):
   - Open the project in Android Studio.
   - Run the application on an Android device or emulator.

3. Machine Learning Models (Python):
   - Navigate to the respective model directory (`CategoryPredictionModel`, `DuplicatePredictionModel`).
   - Run the model with Python: `python model.py`.

***********************************************************

FIREBASE DATABASE SETUP

1. Create a project using Firebase Console and enable Firestore.
2. Update the Firebase configuration in the `firebase.js` file located in the `Crime_reporting` directory.
3. Connect the Firebase account with the Android application:
   - Go to Android Studio and follow the Firebase integration steps to link the app with Firestore.

***********************************************************

MACHINE LEARNING MODELS

1. Category Prediction Model:
   - Located in the `CategoryPredictionModel` directory.
   - Predicts the category of a crime based on the description provided by the user.

2. Duplicate Prediction Model:
   - Located in the `DuplicatePredictionModel` directory.
   - Detects duplicate crime reports based on location and description similarity.

***********************************************************

MOBILE APP (ANDROID)

The Android mobile app was developed using Android Studio with Java, targeting Android 5.0 (Lollipop) and above. The app allows users to report crimes, share locations, and send relevant evidence (images, videos, etc.).

***********************************************************

WEB APP (REACT)

The web app is built using React. It provides a dashboard for law enforcement to manage crime reports, user feedback, and view crime statistics.

***********************************************************
