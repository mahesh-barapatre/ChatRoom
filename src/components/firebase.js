import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAEJP6bmxpWLIo7kgoNh40FRjwsWDL2LNA",
  authDomain: "kittychat-67baa.firebaseapp.com",
  projectId: "kittychat-67baa",
  storageBucket: "kittychat-67baa.appspot.com",
  messagingSenderId: "61997172287",
  appId: "1:61997172287:web:e0b919bd1c691b643a5a8a"
};

export const app = initializeApp(firebaseConfig);