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

// Configuration loaded from firebase-applet-config.json
const firebaseConfig = {
  projectId: "gen-lang-client-0928801489",
  appId: "1:603740153599:web:061864125a60a20a164eca",
  apiKey: "AIzaSyAfWw8gWWi0GNxTcWOiD4fq2OvBwu6HpAM",
  authDomain: "gen-lang-client-0928801489.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-tonemarkaianimat-fb417753-ba4f-45af-b0f9-6fb80f9dee5f",
  storageBucket: "gen-lang-client-0928801489.firebasestorage.app",
  messagingSenderId: "603740153599",
};

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
