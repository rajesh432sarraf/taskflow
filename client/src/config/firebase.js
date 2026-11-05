import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

/**
 * Firebase Client Configuration.
 * Values are provided via environment variables (VITE_FIREBASE_*),
 * with production fallbacks to ensure cloud deployments function out-of-the-box.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBT7SkCfFWiJBczkzF7nwqQJ1Z6IwwFEcY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'taskflow-app-cb73c.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'taskflow-app-cb73c',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'taskflow-app-cb73c.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '556577635301',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:556577635301:web:20ae1905ca85ae08898d0c',
};

let auth = null;
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

try {
  if (firebaseConfig.apiKey) {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
  }
} catch (error) {
  console.warn('Firebase initialization warning:', error.message);
}

export { auth, googleProvider, signInWithPopup };

