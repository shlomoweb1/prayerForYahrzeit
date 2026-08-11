//  kadish-yatom.web.app
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAegEX4nnFzdWUxtWyHAW9aJIUe7Ov61Q8",
  authDomain: "kadish-yatom.firebaseapp.com",
  projectId: "kadish-yatom",
  storageBucket: "kadish-yatom.firebasestorage.app",
  messagingSenderId: "905242754657",
  appId: "1:905242754657:web:433d764ef8a5eb2fdb3420",
  measurementId: "G-R8EMMEGK97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);