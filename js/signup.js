import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const msg = document.getElementById("msg");

function errorText(code) {
  const map = {
    "auth/invalid-email": "الإيميل مش مكتوب صح",
    "auth/email-already-in-use": "الإيميل ده مسجّل قبل كده، روح لصفحة تسجيل الدخول",
    "auth/weak-password": "كلمة المرور ضعيفة، لازم 6 حروف أو أكتر",
    "auth/missing-password": "اكتب كلمة المرور",
    "auth/too-many-requests": "محاولات كتير، استنى شوية وجرّب تاني"
  };
  return map[code] || "حصل خطأ، حاول مرة تانية";
}

document.getElementById("signupBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;
  msg.textContent = "";

  if (password !== confirm) {
    msg.textContent = "كلمتا المرور مش متطابقتين";
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    location.href = "index.html";
  } catch (e) {
    msg.textContent = errorText(e.code);
  }
});