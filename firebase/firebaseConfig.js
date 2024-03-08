// //! CONFIGURACION DE FIREBASE

// // import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// // import { getAuth } from "firebase/auth";
// // import { getFirestore } from "firebase/firestore";
// // // TODO: Add SDKs for Firebase products that you want to use

// // const firebaseConfig = {
// //     apiKey: process.env.NEXT_PUBLIC_API_KEY,
// //     authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
// //     projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
// //     storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
// //     messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
// //     appId: process.env.NEXT_PUBLIC_APP_ID,
// //     measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
// // };

// // // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// // //export const analytics = getAnalytics(app);
// // export const auth = getAuth(app);
// // export const firestore = getFirestore(app);
// //*-----------------------------------------------------------------------------------------
// // Import the functions you need from the SDKs you need
// // import { initializeApp } from "firebase/app";
// // // TODO: Add SDKs for Firebase products that you want to use
// // // https://firebase.google.com/docs/web/setup#available-libraries

// // // Your web app's Firebase configuration
// // const firebaseConfig = {
// //   apiKey: "AIzaSyCd5WA_a4Wnt1FHtBxDlgNsEY6GMJ9D92w",
// //   authDomain: "proyecto1-sw1.firebaseapp.com",
// //   databaseURL: "https://proyecto1-sw1-default-rtdb.firebaseio.com",
// //   projectId: "proyecto1-sw1",
// //   storageBucket: "proyecto1-sw1.appspot.com",
// //   messagingSenderId: "305580611118",
// //   appId: "1:305580611118:web:7f417e895b1c1c9e47b1bf"
// // };

// // // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// require('dotenv').config()
// const admin=require('firebase-admin')
// const {initializeApp,applicationDefault}=require('firebase-admin/app')
// const {getFirestore}=require('firebase-admin/firestore')
// let serviceAccount = require('../firebaseJSON/firebase.json')
// initializeApp({   
//     credential:admin.credential.cert(serviceAccount)
// })

// const db=getFirestore()

// module.exports={db}