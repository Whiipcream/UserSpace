import {
  db, auth, collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc, getDoc, onAuthStateChanged, signOut
} from "./firebase.js";

const displayNameElem = document.getElementById("display-name");
const profilePicElem = document.getElementById("profile-pic");
const uploadPicInput = document.getElementById("upload-profile-pic");
const btnUploadPic = document.getElementById("btn-upload-pic");
const btnEditProfile = document.getElementById("btn-edit-profile");
const profileSettings = document.getElementById("profile-settings");
const inputDisplayName = document.getElementById("input-display-name");
const btnSaveSettings = document.getElementById("btn-save-settings");
const btnCancelSettings = document.getElementById("btn-cancel-settings");

const newPostText = document.getElementById("new-post-text");
const btnPost = document.getElementById("btn-post");
const postsContainer = document.getElementById("posts-container");

const btnLogout = document.getElementById("btn-logout");

const navProfile = document.getElementById("btn-profile");
const navWall = document.getElementById("btn-wall");
const navFriends = document.getElementById("btn-friends");
const navThemes = document.getElementById("btn-themes");

let currentUserId = null;

// --- AUTH STATE HANDLING ---

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUserId = user.uid;
    await loadUserProfile(user.uid);
    setupPostsListener(user.uid);
  } else {
    window.location.href = "index.html";
  }
});

// --- LOAD USER PROFILE ---

async function loadUserProfile(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    const userData = userDoc.data();
    displayNameElem.textContent = userData.displayName || "User Name";
    inputDisplayName.value = userData.displayName || "";
    profilePicElem.src = userData.profilePicUrl || "default-profile.png";
  } else {
    // User doc missing: create with default values
    await updateDoc(doc(db, "users", uid), {
      displayName: "User Name",
      profilePicUrl: "default-profile.png",
    });
  }
}

// --- POSTS HANDLING ---

function setupPostsListener(uid) {
  const postsQuery = query(collection(db, "posts"), where("uid", "==", uid));
  onSnapshot(postsQuery, (snapshot) => {
    postsContainer.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const post = docSnap.data();
      const postId = docSnap.id;
      postsContainer.appendChild(createPostElement(post, postId));
    });
  });
}

function createPostElement(post, postId) {
  const postEl = document.createElement("div");
  postEl.className = "post";

  const contentEl = document.createElement("p");
  contentEl.textContent = post.content;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete Post";
  deleteBtn.onclick = async () => {
    await deleteDoc(doc(db, "posts", postId));
  };

  postEl.appendChild(contentEl);
  postEl.appendChild(deleteBtn);
  return postEl;
}

btnPost.addEventListener("click", async () => {
  if (!newPostText.value.trim()) return alert("Post content cannot be empty.");
  await addDoc(collection(db, "posts"), {
    uid: currentUserId,
    content: newPostText.value,
    createdAt: new Date(),
  });
  newPostText.value = "";
});

// --- PROFILE SETTINGS ---

btnEditProfile.addEventListener("click", () => {
  profileSettings.classList.remove("hidden");
});

btnCancelSettings.addEventListener("click", () => {
  profileSettings.classList.add("hidden");
});

btnSaveSettings.addEventListener("click", async () => {
  if (!inputDisplayName.value.trim()) return alert("Display name cannot be empty.");
  await updateDoc(doc(db, "users", currentUserId), {
    displayName: inputDisplayName.value.trim(),
  });
  displayNameElem.textContent = inputDisplayName.value.trim();
  profileSettings.classList.add("hidden");
});

// --- PROFILE PICTURE UPLOAD ---

btnUploadPic.addEventListener("click", () => {
  uploadPicInput.click();
});

uploadPicInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // TODO: Upload to Firebase Storage and get URL, update user profilePicUrl
  alert("Profile picture upload not yet implemented.");
});

// --- NAVIGATION BUTTONS ---

navProfile.addEventListener("click", () => {
  // Just reload profile page (current page)
  window.location.href = "profile.html";
});
navWall.addEventListener("click", () => {
  window.location.href = "wall.html";
});
navFriends.addEventListener("click", () => {
  window.location.href = "friends.html";
});
navThemes.addEventListener("click", () => {
  window.location.href = "themes.html";
});

btnLogout.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
