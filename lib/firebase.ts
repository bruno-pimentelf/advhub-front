// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmxneFjOFSoSdZDhKKRCn7k5nyyeR50d8",
  authDomain: "ailum-473302.firebaseapp.com",
  projectId: "ailum-473302",
  storageBucket: "ailum-473302.firebasestorage.app",
  messagingSenderId: "169510772893",
  appId: "1:169510772893:web:b384030425ca40b3d43474",
  measurementId: "G-44135LM4GK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
