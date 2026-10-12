import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const msg = document.getElementById("msg");

function errorText(code) {
  const map = {
    "auth/invalid-credential": "الإيميل أو كلمة المرور غلط",
    "auth/invalid-email": "الإيميل مش مكتوب صح",
    "auth/email-already-in-use": "الإيميل ده مسجّل قبل كده، جرّب تسجّل دخول",
    "auth/weak-password": "كلمة المرور ضعيفة، لازم 6 حروف أو أكتر",
    "auth/missing-password": "اكتب كلمة المرور",
    "auth/too-many-requests": "محاولات كتير، استنى شوية وجرّب تاني"
  };
  return map[code] || "حصل خطأ، حاول مرة تانية";
}

function getValues() {
  return {
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value
  };
}

document.getElementById("loginBtn").addEventListener("click", async () => {
  const { email, password } = getValues();
  msg.textContent = "";
  try {
    await signInWithEmailAndPassword(auth, email, password);
    location.href = "index.html";
  } catch (e) {
    msg.textContent = errorText(e.code);
  }
});

document.getElementById("signupBtn")?.addEventListener("click", async () => {
  const { email, password } = getValues();
  msg.textContent = "";
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    location.href = "index.html";
  } catch (e) {
    msg.textContent = errorText(e.code);
  }
});