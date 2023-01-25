// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: 'AIzaSyDalG1gz-P2ktqY9Ldu40ItErABIqTlRYA',

  authDomain: 'journal-app-react-59e88.firebaseapp.com',

  projectId: 'journal-app-react-59e88',

  storageBucket: 'journal-app-react-59e88.appspot.com',

  messagingSenderId: '7179069124',

  appId: '1:7179069124:web:2920236b359f0eb9928b91',
};

// Initialize Firebase

export const FirebaseApp = initializeApp(firebaseConfig);

export const FirebaseAuth = getAuth(FirebaseApp);

export const FirebaseDB = getFirestore(FirebaseApp);
