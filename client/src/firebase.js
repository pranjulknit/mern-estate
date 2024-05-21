// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-981d0.firebaseapp.com",
  projectId: "mern-estate-981d0",
  storageBucket: "mern-estate-981d0.appspot.com",
  messagingSenderId: "495970837823",
  appId: "1:495970837823:web:2cf9a18d727a4252cc1f8a"
};

// Initialize Firebase
export   const app = initializeApp(firebaseConfig);