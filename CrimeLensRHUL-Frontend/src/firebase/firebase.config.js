import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// FireBase config file, you will have to place your Firebase information here if you decide to run
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Exporting Variables
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export const database = getAuth(app)
export default auth;