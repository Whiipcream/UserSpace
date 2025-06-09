// app.js
import {
  auth, db, storage, storageRef, uploadBytes, getDownloadURL,
  collection, doc, getDoc, setDoc, addDoc, deleteDoc,
  query, where, getDocs, updateDoc, orderBy, onAuthStateChanged, signOut
} from './firebase.js';

const usernameEl = document.getElementById('username');
const postBtn = document.getElementById('postBtn');
const postContent = document.getElementById('postContent');
const postFeed = document.getElementById('postFeed');
const logoutBtn = document.getElementById('logoutBtn');
const profilePicInput = document.getElementById('profilePicInput');
const profilePic = document.getElementById('profilePic');
const saveProfileBtn = document.getElementById('saveProfileBtn');

let currentUser;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      usernameEl.textContent = userSnap.data().username || user.email;
      const picUrl = userSnap.data().profilePicUrl;
      if (picUrl) profilePic.src = picUrl;
    } else {
      await setDoc(userDocRef, { username: user.email });
      usernameEl.textContent = user.email;
    }

    loadPosts();
  } else {
    window.location.href = "index.html";
  }
});

logoutBtn.onclick = () => signOut(auth);

postBtn.onclick = async () => {
  const content = postContent.value.trim();
  if (!content) return;
  await addDoc(collection(db, "posts"), {
    uid: currentUser.uid,
    username: usernameEl.textContent,
    content,
    timestamp: Date.now()
  });
  postContent.value = "";
  loadPosts();
};

async function loadPosts() {
  postFeed.innerHTML = "";
  const q = query(collection(db, "posts"), where("uid", "==", currentUser.uid), orderBy("timestamp", "desc"));
  const querySnap = await getDocs(q);
  querySnap.forEach(docSnap => {
    const post = docSnap.data();
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <p><strong>${post.username}</strong></p>
      <p>${post.content}</p>
      <button onclick="deletePost('${docSnap.id}')">🗑️ Delete</button>
    `;
    postFeed.appendChild(div);
  });
}

window.deletePost = async (id) => {
  await deleteDoc(doc(db, "posts", id));
  loadPosts();
};

profilePicInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const fileRef = storageRef(storage, `profilePics/${currentUser.uid}`);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  await updateDoc(doc(db, "users", currentUser.uid), { profilePicUrl: url });
  profilePic.src = url;
});

saveProfileBtn.onclick = async () => {
  const newUsername = document.getElementById('editUsername').value;
  if (newUsername.trim()) {
    await updateDoc(doc(db, "users", currentUser.uid), { username: newUsername });
    usernameEl.textContent = newUsername;
  }
};

window.toggleSettings = () => {
  document.getElementById("settingsPanel").classList.toggle("hidden");
};
