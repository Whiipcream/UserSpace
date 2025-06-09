// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  updateDoc,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyD-Uo84sAcOeKyXDilFZxW4W-AhvZ6JWus",
  authDomain: "socialwave-app.firebaseapp.com",
  projectId: "socialwave-app",
  storageBucket: "socialwave-app.appspot.com",
  messagingSenderId: "384197971951",
  appId: "1:384197971951:web:fe663c8eb4d62e60b8cb92",
  measurementId: "G-8V2PBZJGSP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

export {
  auth,
  db,
  storage,
  storageRef,
  uploadBytes,
  getDownloadURL,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  updateDoc,
  orderBy,
  onAuthStateChanged,
  signOut
};
