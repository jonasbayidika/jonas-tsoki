
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQklOYE_28jj-yw91EbEV03JZOJIzmQCo",
  authDomain: "copy-of-bomoko-jeunesse-congo.firebaseapp.com",
  projectId: "copy-of-bomoko-jeunesse-congo",
  storageBucket: "copy-of-bomoko-jeunesse-congo.firebasestorage.app",
  messagingSenderId: "346314580566",
  appId: "1:346314580566:web:57c6e1ebcd2986c74c11f7"
};

// Initialize Firebase with the modular initializeApp function
const app = initializeApp(firebaseConfig);
// Initialize Auth with the modular getAuth function
const auth = getAuth(app);

/**
 * INITIALISATION FIRESTORE OPTIMISÉE
 * Nous utilisons persistentLocalCache mais sans persistentMultipleTabManager 
 * pour éviter les erreurs "Could not reach backend" (timeout 10s) 
 * fréquentes dans les environnements de développement web.
 */
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({})
});

export { app, auth, db };
