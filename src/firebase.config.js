// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6pQOGxclyNCBgsCCxoYQ8GzH_jfEjxX4",
  authDomain: "house-marketplace-app-79c03.firebaseapp.com",
  projectId: "house-marketplace-app-79c03",
  storageBucket: "house-marketplace-app-79c03.firebasestorage.app",
  messagingSenderId: "109636442238",
  appId: "1:109636442238:web:2530ece246cf6c51dbe02f",
  measurementId: "G-H6Q8MCP4RM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
