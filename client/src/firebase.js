// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cyber-soc-c8ae5.firebaseapp.com",
  projectId: "cyber-soc-c8ae5",
  storageBucket: "cyber-soc-c8ae5.firebasestorage.app",
  messagingSenderId: "186885254432",
  appId: "1:186885254432:web:da5a96e39af389c0437b45",
  measurementId: "G-2T92X9EWDG"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
