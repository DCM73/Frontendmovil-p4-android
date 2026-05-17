// Importamos las herramientas nativas de Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCYw1VusLFl0WT14CjZpxD8PZxtjSZxM3A",
  authDomain: "equipobasketedu.firebaseapp.com",
  projectId: "equipobasketedu",
  storageBucket: "equipobasketedu.firebasestorage.app",
  messagingSenderId: "155949175729",
  appId: "1:155949175729:web:3cfd793bc4f2f4d6906390"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);