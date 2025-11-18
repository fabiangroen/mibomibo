import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCvPOztK-0Yg_Qx8YhCC9W8eo70VImfL4o",
  authDomain: "mibo-9fa47.firebaseapp.com",
  databaseURL:
    "https://mibo-9fa47-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mibo-9fa47",
  storageBucket: "mibo-9fa47.firebasestorage.app",
  messagingSenderId: "307219626182",
  appId: "1:307219626182:web:a5845125af3189776e3fc7",
  measurementId: "G-2KQ916J091",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

signInAnonymously(auth).catch((error) => {
  console.error("Auth failed", error);
});
