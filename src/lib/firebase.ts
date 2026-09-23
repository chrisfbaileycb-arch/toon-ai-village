import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let app: FirebaseApp;
let db: Firestore | null = null;
let isFirebaseAvailable = false;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  // Initialize Firestore with specific databaseId if provided
  if (firebaseConfig.firestoreDatabaseId) {
    try {
      db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
      isFirebaseAvailable = true;
    } catch {
      // Fallback to default database if named database isn't ready
      db = getFirestore(app);
      isFirebaseAvailable = true;
    }
  } else {
    db = getFirestore(app);
    isFirebaseAvailable = true;
  }
} catch (err) {
  console.warn('Firebase initialization warning:', err);
  isFirebaseAvailable = false;
}

export {
  app,
  db,
  isFirebaseAvailable,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
};
