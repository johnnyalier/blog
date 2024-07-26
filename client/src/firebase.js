// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: "mern-blog-58da0.firebaseapp.com",
  projectId: "mern-blog-58da0",
  storageBucket: "mern-blog-58da0.appspot.com",
  messagingSenderId: "1027086064189",
  appId: "1:1027086064189:web:16671f360308b265e06854"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);