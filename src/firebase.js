// FILE: src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Seu objeto de configuração do Firebase que você copiou
const firebaseConfig = {
  apiKey: "AIzaSyBnyoZbWaC8591LdjKoExndT559h6vM3H4",
  authDomain: "controle-financeiro-pess-69333.firebaseapp.com",
  projectId: "controle-financeiro-pess-69333",
  storageBucket: "controle-financeiro-pess-69333.firebasestorage.app",
  messagingSenderId: "1054301903400",
  appId: "1:1054301903400:web:58b8fd94605a2ac4aaf31d",
  measurementId: "G-JESPYMPHX5"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços que vamos usar
export const auth = getAuth(app);
export const db = getFirestore(app);