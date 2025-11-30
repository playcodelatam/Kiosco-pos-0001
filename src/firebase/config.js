import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCD1D_eaRSZJ5BKg2pW4kWjfc7pPiHXsCk",
  authDomain: "kiosko-pos-ar.firebaseapp.com",
  projectId: "kiosko-pos-ar",
  storageBucket: "kiosko-pos-ar.firebasestorage.app",
  messagingSenderId: "389330669912",
  appId: "1:389330669912:web:c142af16ed30697251152d",
  measurementId: "G-XLVDH2164L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export { auth, db, storage };