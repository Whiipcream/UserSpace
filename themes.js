import {
  db, auth, doc, getDoc, updateDoc, onAuthStateChanged, signOut
} from "./firebase.js";

const inputBgColor = document.getElementById("input-bg-color");
const inputTextColor = document.getElementById("input-text-color");
const btnSaveTheme = document.getElementById("btn-save-theme");

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
    await loadTheme();
  }
});

async function loadTheme() {
  const userDoc = await getDoc(doc(db, "users", currentUserId));
  if (userDoc.exists()) {
    const data = userDoc.data();
    inputBgColor.value = data.themeBgColor || "#ffffff";
    inputTextColor.value = data.themeTextColor || "#000000";
    applyTheme(inputBgColor.value, inputTextColor.value);
  }
}

function applyTheme(bg, text) {
  document.body.style.backgroundColor = bg;
  document.body.style.color = text;
}

btnSaveTheme.addEventListener("click", async () => {
  await updateDoc(doc(db, "users", currentUserId), {
    themeBgColor: inputBgColor.value,
    themeTextColor: inputTextColor.value,
  });
  applyTheme(inputBgColor.value, inputTextColor.value);
  alert("Theme saved!");
});

navProfile.addEventListener("click", () => window.location.href = "profile.html");
navWall.addEventListener("click", () => window.location.href = "wall.html");
navFriends.addEventListener("click", () => window.location.href = "friends.html");
navThemes.addEventListener("click", () => window.location.href = "themes.html");
btnLogout.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
