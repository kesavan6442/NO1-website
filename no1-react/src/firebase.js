import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Standard Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq20OA9O8udzifd8hQUjh9h_PtqWnpgGM",
  authDomain: "number-one-4c024.firebaseapp.com",
  projectId: "number-one-4c024",
  storageBucket: "number-one-4c024.appspot.com",
  messagingSenderId: "813956898953",
  appId: "1:813956898953:web:9c7820c78864789886678"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
