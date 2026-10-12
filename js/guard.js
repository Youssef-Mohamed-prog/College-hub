import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.documentElement.style.visibility = "hidden";

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.documentElement.style.visibility = "visible";
  } else {
    location.href = "login.html";
  }
});