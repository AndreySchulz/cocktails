import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { getRenderLogin, renderUser } from './get-login-render';

const firebaseConfig = {
  apiKey: 'AIzaSyDP0ezK6Jh8THcgopz24LdXtUN7Vm4n2g4',
  authDomain: 'cocktails-f63a0.firebaseapp.com',
  projectId: 'cocktails-f63a0',
  storageBucket: 'cocktails-f63a0.appspot.com',
  messagingSenderId: '477783115593',
  appId: '1:477783115593:web:d5a83b2b774684d061fc98',
  databaseURL:
    'https://cocktails-f63a0-default-rtdb.europe-west1.firebasedatabase.app/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };

export function onAuthClickCreate(boxAuthBtn) {
  const provider = new GoogleAuthProvider();
  return function (event) {
    if (event.target.id == 'authBtn') {
      const auth = getAuth();
      auth.languageCode = 'ua';

      if (!auth.currentUser) {
        signInWithPopup(auth, provider)
          .then(result => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            //const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;

            renderUser(user, event.target, boxAuthBtn);
            // ...
          })
          .catch(error => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
          });
      }
    }
    if (event.target.id == 'logout') {
      event.preventDefault();
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          boxAuthBtn.innerHTML = `<button class="header-btn" id="authBtn" type="button">Sing in</button>`;
          //event.currentTarget.append(authBtn)
        })
        .catch(error => {
          // An error happened.
        });
    }
  };
}

const boxAuthBtn = document.querySelector('#authBtnLog');

const auth = getAuth(app);
onAuthStateChanged(auth, user => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    // const uid = user.uid;
    // const user = result.user;

    renderUser(user, authBtn, boxAuthBtn);
    // ...
  } else {
    // User is signed out
    // ...
  }
});

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
