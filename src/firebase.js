import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace with your Firebase project config from console.firebase.google.com
const firebaseConfig = {
  apiKey: 'AIzaSyC3BO9eZ2xiV3DlINQAHhcVt-kTfzT83i4',
  authDomain: 'election-edu-1be18.firebaseapp.com',
  projectId: 'election-edu-1be18',
  storageBucket: "election-edu-1be18.firebasestorage.app",
  messagingSenderId: "879217153684",
  appId: "1:879217153684:web:4863ad78473a65890f4681",
  measurementId: "G-XXXXXXXXXX"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

/**
 * Logs a custom event to Firebase Analytics.
 * @param {string} eventName - Name of the event.
 * @param {Object} params - Event parameters.
 */
export function trackEvent(eventName, params = {}) {
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
}
