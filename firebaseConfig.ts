// firebaseConfig.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyANf-7OFSpCKXn2n87sXpl136m0607h2Io",
  authDomain: "recibiendo-notificaciones-push.firebaseapp.com",
  databaseURL: "https://recibiendo-notificaciones-push-default-rtdb.firebaseio.com",
  projectId: "recibiendo-notificaciones-push",
  storageBucket: "recibiendo-notificaciones-push.firebasestorage.app",
  messagingSenderId: "105973429774",
  appId: "1:105973429774:android:bd497f52db63d0ab2a2e5f",
};

let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}


export const db = getDatabase(app);


console.log("🔥 Firebase projectId (config):", app.options.projectId);
console.log("🔥 Firebase databaseURL (config):", app.options.databaseURL);

if (app.options.projectId !== "recibiendo-notificaciones-push") {
  console.warn(
    "⚠️ OJO: Estás inicializando Firebase con un proyecto inesperado:",
    app.options.projectId
  );
}
