import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyDRMiuuaTpxLnWJ47Vez5L5e7CJd0pNhDU",
    authDomain: "wazopulse.firebaseapp.com",
    projectId: "wazopulse",
    storageBucket: "wazopulse.firebasestorage.app",
    messagingSenderId: "609775900755",
    appId: "1:609775900755:web:708de4af625a0a9e6f4ea6",
    measurementId: "G-HVWPXNLPFM"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
