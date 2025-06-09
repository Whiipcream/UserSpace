import {
  auth, db, onAuthStateChanged, collection, getDocs, query, where
} from './firebase.js';

const friendsList = document.getElementById("friendsList");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const q = query(collection(db, "users"), where("uid", "!=", user.uid));
    const snap = await getDocs(q);
    friendsList.innerHTML = "";
    snap.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.textContent = data.username || doc.id;
      friendsList.appendChild(div);
    });
  } else {
    location.href = "index.html";
  }
});
