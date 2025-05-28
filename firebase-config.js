// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDEr_LvmZ_U-T2_x9e6BZVhyQ9wawVCrj4",
  authDomain: "baseball-recording-app.firebaseapp.com",
  projectId: "baseball-recording-app",
  storageBucket: "baseball-recording-app.firebasestorage.app",
  messagingSenderId: "385930309533",
  appId: "1:385930309533:web:fd7c6ed21ee5cc1c92c974",
  measurementId: "G-55N39TKJPX"
};

const app = initializeApp(firebaseConfig);
window.db = getFirestore(app);
