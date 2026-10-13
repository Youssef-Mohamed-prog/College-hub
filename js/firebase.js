import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCF8qCYb5lDAZhBw-Z9tCNK51HoSnYyD2s",
  authDomain: "education-platform-ed0ca.firebaseapp.com",
  projectId: "education-platform-ed0ca",
  storageBucket: "education-platform-ed0ca.firebasestorage.app",
  messagingSenderId: "649972567731",
  appId: "1:649972567731:web:9bb976e129c50a00ac6ac6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);