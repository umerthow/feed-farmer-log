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
  apiKey: "AIzaSyCM0dL7Jky-OOBY5vaO3VSlR8AbYPOdpZg",
  authDomain: "libela-411302.firebaseapp.com",
  projectId: "libela-411302",
  storageBucket: "libela-411302.firebasestorage.app",
  messagingSenderId: "423911887089",
  appId: "1:423911887089:web:4d7c42441bc6c4fd785950",
  measurementId: "G-FBLM4TP9NQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
