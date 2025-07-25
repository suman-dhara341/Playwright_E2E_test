importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDRMiuuaTpxLnWJ47Vez5L5e7CJd0pNhDU",
  authDomain: "wazopulse.firebaseapp.com",
  projectId: "wazopulse",
  storageBucket: "wazopulse.firebasestorage.app",
  messagingSenderId: "609775900755",
  appId: "1:609775900755:web:708de4af625a0a9e6f4ea6",
  measurementId: "G-HVWPXNLPFM"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, { body });
});
