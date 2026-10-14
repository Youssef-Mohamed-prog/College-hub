import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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

document.addEventListener("click", async (e) => {
  const el = e.target.closest("button, a, [data-logout], #logoutBtn");
  if (!el) return;
  const label = (el.getAttribute("aria-label") || "") + " " + el.textContent;
  const isLogout =
    el.matches("[data-logout], #logoutBtn") ||
    (/تسجيل\s*(ال)?خروج/.test(label) && label.length < 40);
  if (!isLogout) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  try { await signOut(auth); } catch (err) {}
  localStorage.removeItem("bis_logged_in");
  location.href = "login.html";
}, true);