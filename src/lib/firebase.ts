import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA4AMXAVXJXwZxpLFXoW3ctLqVDTjBZcAc",
  authDomain: "ippon-whisper-app.firebaseapp.com",
  projectId: "ippon-whisper-app",
  storageBucket: "ippon-whisper-app.appspot.com", 
  messagingSenderId: "344575813211",
  appId: "1:344575813211:web:2fc560ab3ce22b1679417e",
  measurementId: "G-TPYM446QWF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);  // ✅ now you can upload images

// Analytics (browser-only)
export const analytics = (async () =>
  (await isSupported()) ? getAnalytics(app) : null)();
