// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4ViF4nVtTVi3CXQroKmz86i0Ip7-Myi8",
  authDomain: "interior-ai-1e764.firebaseapp.com",
  projectId: "interior-ai-1e764",
  storageBucket: "interior-ai-1e764.firebasestorage.app",
  messagingSenderId: "955642638275",
  appId: "1:955642638275:web:b17c933158fb3bc11a5776"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);