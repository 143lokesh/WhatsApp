
import { initializeApp } from "firebase/app";
import {getAuth}  from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDDt9wNaRKdc0Ix-gw6YKOrzO-uS_ENvRU",
    authDomain: "whatsapp-clone-3eece.firebaseapp.com",
    projectId: "whatsapp-clone-3eece",
    storageBucket: "whatsapp-clone-3eece.appspot.com",
    messagingSenderId: "406881872952",
    appId: "1:406881872952:web:3bff4ec2ba3faaf2720acd",
    measurementId: "G-5L7238D02T"
  };

  const app=initializeApp(firebaseConfig);
  export const firebaseAuth=getAuth(app);