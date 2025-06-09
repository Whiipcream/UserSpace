// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCIZKKu6y00Q5QpaEzaIddoPD844QnUPBk",
  authDomain: "userspace-c42b3.firebaseapp.com",
  projectId: "userspace-c42b3",
  storageBucket: "userspace-c42b3.appspot.com",
  messagingSenderId: "201689446744",
  appId: "1:201689446744:web:13e2062781c517189f4d2d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
