import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCn75ZFEENtA-lOPe5DukjHoJqHrUgQI4Q",
  authDomain: "schedule-project-de318.firebaseapp.com",
  projectId: "schedule-project-de318",
  storageBucket: "schedule-project-de318.appspot.com",
  messagingSenderId: "404675321561",
  appId: "1:404675321561:web:b14635b7214f0b7845e8c8",
};

const app = initializeApp(firebaseConfig);

// 🔥 Firestore 인스턴스
export const db = getFirestore(app);
