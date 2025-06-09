// app.js
import { auth, db, storage } from './firebase.js';
import {
  onAuthStateChanged, signOut, updateProfile
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, deleteDoc, doc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-storage.js";

const profilePicImg = document.getElementById('profile-pic');
const profileName = document.getElementById('profile-name');
const profileBio = document.getElementById('profile-bio');
const newPostForm = document.getElementById('new-post-form');
const newPostInput = document.getElementById('new-post-input');
const postBtn = document.getElementById('post-btn');
const postsList = document.getElementById('posts-list');
const navProfile = document.getElementById('nav-profile');
const navHome = document.getElementById('nav-home');
const navSettings = document.getElementById('nav-settings');
const settingsPanel = document.getElementById('settings-panel');
let currentUser, postsUnsub, picFile = null;

onAuthStateChanged(auth, user => {
  if (!user) return location.href = 'index.html';
  currentUser = user; initializeProfile(); subscribePosts();
});

function initializeProfile() {
  profileName.textContent = currentUser.displayName || "Unnamed User";
  profileBio.textContent = "";
  profilePicImg.src = currentUser.photoURL || 'https://via.placeholder.com/100?text=Profile';

  profilePicImg.addEventListener('click', () => {
    document.getElementById('profile-pic-upload').click();
  });
  postBtn.disabled = true;
  navSettings.addEventListener('click', () => {
    settingsPanel.classList.toggle('open');
  });

  document.getElementById('profile-pic-upload').addEventListener('change', e => { picFile = e.target.files[0]; });
  document.getElementById('save-settings-btn').addEventListener('click', saveSettings);
  document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));
  newPostInput.addEventListener('input', () => postBtn.disabled = !newPostInput.value.trim());
  newPostForm.addEventListener('submit', submitPost);
}

async function saveSettings() {
  const newName = document.getElementById('edit-name').value.trim();
  const newBio = document.getElementById('edit-bio').value.trim();
  let newURL = currentUser.photoURL;

  if (picFile) {
    const snap = await uploadBytes(ref(storage, `profilePics/${currentUser.uid}_${Date.now()}`), picFile);
    newURL = await getDownloadURL(snap.ref);
  }
  if (newName) await updateProfile(currentUser, { displayName: newName, photoURL: newURL });
  await db.collection('users').doc(currentUser.uid).set({ displayName: newName, bio: newBio, photoURL: newURL }, { merge: true });
  profileName.textContent = newName; profileBio.textContent = newBio;
  profilePicImg.src = newURL;
  settingsPanel.classList.remove('open');
}

function subscribePosts() {
  if (postsUnsub) postsUnsub();
  postsUnsub = onSnapshot(
    query(collection(db, 'posts'),
      where('uid','==',currentUser.uid),
      orderBy('createdAt','desc')
    ),
    snap => {
      postsList.innerHTML = '';
      if (snap.empty) postsList.innerHTML = '<p style="text-align:center;color:#606770">No posts yet.</p>';
      snap.forEach(d => postsList.appendChild(buildPost(d.id, d.data())));
    }
  );
}

function buildPost(id, data) {
  const div = document.createElement('div'); div.className = 'post';
  div.innerHTML = `
    <div class="post-header">
      <img class="post-profile-pic" src="${data.photoURL || ''}" />
      <span class="post-user-name">${data.displayName || ''}</span>
      <span class="post-date">${data.createdAt?.toDate().toLocaleString() || ''}</span>
      <button class="post-delete-btn">Delete</button>
    </div>
    <div class="post-text">${data.text}</div>`;
  div.querySelector('.post-delete-btn').addEventListener('click', () => deleteDoc(doc(db, 'posts', id)));
  return div;
}

async function submitPost(e) {
  e.preventDefault();
  const text = newPostInput.value.trim();
  await addDoc(collection(db, 'posts'), {
    uid: currentUser.uid,
    displayName: currentUser.displayName,
    photoURL: currentUser.photoURL,
    text,
    createdAt: serverTimestamp()
  });
  newPostInput.value = '';
}
