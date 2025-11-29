import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD4wklXOOrSHnr4Z_cZeWSIqQt1Orjaruk",
  authDomain: "kiosco-d0924.firebaseapp.com",
  projectId: "kiosco-d0924",
  storageBucket: "kiosco-d0924.firebasestorage.app",
  messagingSenderId: "304216045156",
  appId: "1:304216045156:web:89f308e04f63f349eb1171"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export { auth, db, storage };