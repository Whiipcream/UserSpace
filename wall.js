import {
  db, auth, collection, query, onSnapshot, orderBy, signOut, onAuthStateChanged
} from "./firebase.js";

const wallPostsContainer = document.getElementById("wall-posts-container");
const navProfile = document.getElementById("btn-profile");
const navWall = document.getElementById("btn-wall");
const navFriends = document.getElementById("btn-friends");
const navThemes = document.getElementById("btn-themes");
const btnLogout = document.getElementById("btn-logout");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    setupWallListener();
  }
});

function setupWallListener() {
  const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  onSnapshot(postsQuery, (snapshot) => {
    wallPostsContainer.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const post = docSnap.data();
      const postEl = document.createElement("div");
      postEl.className = "post";
      postEl.textContent = `${post.content} — posted by ${post.uid}`;
      wallPostsContainer.appendChild(postEl);
    });
  });
}

navProfile.addEventListener("click", () => window.location.href = "profile.html");
navWall.addEventListener("click", () => window.location.href = "wall.html");
navFriends.addEventListener("click", () => window.location.href = "friends.html");
navThemes.addEventListener("click", () => window.location.href = "themes.html");
btnLogout.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
