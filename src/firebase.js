import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace with your Firebase project config from console.firebase.google.com
const firebaseConfig = {
  apiKey: '_',
  authDomain: '_',
  projectId: '_',
  storageBucket: "_",
  messagingSenderId: "_",
  appId: "_"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


