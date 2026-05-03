import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
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
  appId: "_",
  measurementId: "_"
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
