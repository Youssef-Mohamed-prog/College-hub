import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const wasLoggedIn = localStorage.getItem("bis_logged_in") === "1";
if (!wasLoggedIn) document.documentElement.style.visibility = "hidden";

onAuthStateChanged(auth, (user) => {
  if (user) {
    localStorage.setItem("bis_logged_in", "1");
    document.documentElement.style.visibility = "visible";
  } else {
    localStorage.removeItem("bis_logged_in");
    location.href = "login.html";
  }
});
