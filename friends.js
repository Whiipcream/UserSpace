import {
  db, auth, collection, query, where, onSnapshot, addDoc, deleteDoc, doc, getDoc, onAuthStateChanged, signOut
} from "./firebase.js";

const friendsListContainer = document.getElementById("friends-list-container");
const navProfile = document.getElementById("btn-profile");
const navWall = document.getElementById("btn-wall");
const navFriends = document.getElementById("btn-friends");
const navThemes = document.getElementById("btn-themes");
const btnLogout = document.getElementById("btn-logout");

let currentUserId = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    currentUserId = user.uid;
    loadFriends();
  }
});

async function loadFriends() {
  const friendsQuery = query(collection(db, "friends"), where("userId", "==", currentUserId));
  onSnapshot(friendsQuery, (snapshot) => {
    friendsListContainer.innerHTML = "";
    snapshot.forEach(async (docSnap) => {
      const friendData = docSnap.data();
      const friendUserDoc = await getDoc(doc(db, "users", friendData.friendId));
      const friendUser = friendUserDoc.exists() ? friendUserDoc.data() : { displayName: "Unknown" };

      const friendEl = document.createElement("div");
      friendEl.className = "friend-entry";
      friendEl.textContent = friendUser.displayName;
      friendsListContainer.appendChild(friendEl);
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
