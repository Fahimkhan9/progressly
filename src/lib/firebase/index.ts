import { initializeApp } from "firebase/app";

import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:process.env.NEXT_PUBLIC_MEASUREMENT_ID
};

const app = initializeApp(clientCredentials);

const db = getFirestore(app);
const storage = getStorage(app);

// getToken(messaging,{vapidKey:'BDnHbBOEbibtAmBJF9y2i0LUipGwrLTW_yeHk6ilIb0yBYEfRf_E3Sf0h_wJQduP4JABAnbVo6u7F-W2IIcOoiA'})


const teamCollection = collection(db, "team");
const invitationCollection=collection(db,'invitation')
const teammemberCollection=collection(db,'teammember')
const projectCollection=collection(db,'project')
const taskCollection=collection(db,'task')
const notificationCollection=collection(db,'notification')
export {
  app,
  db,
  storage,
  teamCollection,
  invitationCollection,
  teammemberCollection,
  projectCollection,
  taskCollection,
  notificationCollection
};