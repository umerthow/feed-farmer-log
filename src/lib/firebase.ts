import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

const firebaseConfig = {
  apiKey:  import.meta.env.VITE_FIRE_BASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIRE_BASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIRE_BASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIRE_BASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIRE_BASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIRE_BASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIRE_BASE_MESSUREMENT_ID as string
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
