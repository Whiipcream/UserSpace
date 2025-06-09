// Firebase config + initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCIZKKu6y00Q5QpaEzaIddoPD844QnUPBk",
  authDomain: "userspace-c42b3.firebaseapp.com",
  projectId: "userspace-c42b3",
  storageBucket: "userspace-c42b3.firebasestorage.app",
  messagingSenderId: "201689446744",
  appId: "1:201689446744:web:13e2062781c517189f4d2d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc, getDocs, getDoc, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword };
