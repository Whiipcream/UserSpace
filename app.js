import { auth, db, storage } from './firebase.js';
import {
  doc, setDoc, getDoc, addDoc, collection,
  query, orderBy, onSnapshot, deleteDoc
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import {
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-storage.js";

const usernameEl = document.getElementById('username');
const postBox = document.getElementById('new-post');
const postFeed = document.getElementById('posts-feed');
const profilePic = document.getElementById('profile-pic');
const uploadPic = document.getElementById('upload-pic');

let currentUser;

onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    loadProfile();
    loadPosts();
  } else {
    window.location.href = 'index.html';
  }
});

function loadProfile() {
  usernameEl.textContent = currentUser.email;
}

uploadPic.addEventListener('change', async e => {
  const file = e.target.files[0];
  const storageRef = ref(storage, `profiles/${currentUser.uid}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  await setDoc(doc(db, 'users', currentUser.uid), { photo: url }, { merge: true });
  profilePic.src = url;
});

async function loadPosts() {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  onSnapshot(q, snapshot => {
    postFeed.innerHTML = "";
    snapshot.forEach(doc => {
      const post = doc.data();
      if (post.uid === currentUser.uid) {
        const div = document.createElement("div");
        div.className = "post";
        div.innerHTML = `
          <p>${post.text}</p>
          <button onclick="deletePost('${doc.id}')">Delete</button>
        `;
        postFeed.appendChild(div);
      }
    });
  });
}

window.createPost = async function () {
  const text = postBox.value.trim();
  if (text) {
    await addDoc(collection(db, "posts"), {
      uid: currentUser.uid,
      text,
      timestamp: Date.now()
    });
    postBox.value = "";
  }
};

window.deletePost = async function (id) {
  await deleteDoc(doc(db, "posts", id));
};

window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = 'index.html';
  });
};

window.goTo = function (page) {
  alert(`Coming soon: ${page}`);
};
