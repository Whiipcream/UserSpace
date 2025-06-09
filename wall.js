import {
  db, collection, getDocs, query, orderBy
} from './firebase.js';

const wallFeed = document.getElementById("wallFeed");

async function loadWall() {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const snap = await getDocs(q);
  wallFeed.innerHTML = "";
  snap.forEach(doc => {
    const post = doc.data();
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `<strong>${post.username}</strong><p>${post.content}</p>`;
    wallFeed.appendChild(div);
  });
}

loadWall();
