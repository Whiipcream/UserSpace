import {
  auth, db, onAuthStateChanged, doc, updateDoc
} from './firebase.js';

const bgPicker = document.getElementById("bgColorPicker");

onAuthStateChanged(auth, (user) => {
  if (user) {
    bgPicker.addEventListener("input", () => {
      document.body.style.backgroundColor = bgPicker.value;
    });

    window.saveTheme = async () => {
      await updateDoc(doc(db, "users", user.uid), {
        themeColor: bgPicker.value
      });
    };
  }
});
