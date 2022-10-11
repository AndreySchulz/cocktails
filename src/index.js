// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult,
  onAuthStateChanged
} from 'firebase/auth';

import { Notify } from 'notiflix';
import {
  searchCocktails,
  searchByFirstLetter,
  searchRandom,
} from './js/helpers/api';
import { getAlphabetMarkup, getDrinksMarkup } from './js/helpers/helpers';
import {
  addCocktailToFavorites,
  removeCocktailFromFavorites,
} from './js/favorites';
import { renderCocktailCard } from './js/coctail-modal';
import { renderIngredientCard } from './js/ingredients-modal';
import { getCocktailFavoriteBtn } from './js/favorites';
import {
  showFavoritesCocktails,
  showFavoritesIngredients,
} from './js/favorites-cards';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDP0ezK6Jh8THcgopz24LdXtUN7Vm4n2g4',
  authDomain: 'cocktails-f63a0.firebaseapp.com',
  projectId: 'cocktails-f63a0',
  storageBucket: 'cocktails-f63a0.appspot.com',
  messagingSenderId: '477783115593',
  appId: '1:477783115593:web:d5a83b2b774684d061fc98',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const searchForm = document.querySelector('#form');
const searchField = document.querySelector('#input');
const searchBtn = document.querySelector('#button');
const gallery = document.querySelector('#gallery');
const alphabetUl = document.querySelector('#alphabet');
const templateWithoutResultText = document.querySelector('.gallery__sorry');
templateWithoutResultText.remove();
templateWithoutResultText.classList.remove('is-hidden');
const favoriteCocktails = document.querySelector('[data-cocktails]');
const favoriteIngredients = document.querySelector('[data-ingredients]');

favoriteCocktails.addEventListener('click', showFavoritesCocktails);
favoriteIngredients.addEventListener('click', showFavoritesIngredients);

getAlphabetMarkup(alphabetUl);

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const cocktailName = searchField.value.trim();
  if (cocktailName === '') {
    Notify.info('Please enter the name of your cocktail');
    return;
  }

  const drinks = await searchCocktails(cocktailName);
  if (!drinks.length) {
    gallery.innerHTML = '';
    gallery.append(templateWithoutResultText);
  } else {
    const template = getDrinksMarkup(drinks);

    gallery.innerHTML = /*html*/ `
      <h2 class="gallery__title">Searching results</h2>
      <ul class="gallery__list list">
        ${template.join('')}
      </ul>`;
  }
});

alphabetUl.addEventListener('click', async event => {
  if (event.target.classList.contains('letterInLi')) {
    const resultLetter = event.target.textContent;
    const drinks = await searchByFirstLetter(resultLetter);

    if (!drinks.length) {
      gallery.innerHTML = '';
      gallery.append(templateWithoutResultText);
    } else {
      const template = getDrinksMarkup(drinks);
      gallery.innerHTML = /*html*/ `
        <h2 class="gallery__title">Searching results</h2>
        <ul class="gallery__list list">
          ${template.join('')}
        </ul>`;
    }
  }
});

gallery.addEventListener('click', async event => {
  const addBtn = event.target.closest('[data-add-favorite]');
  if (addBtn) {
    addCocktailToFavorites(addBtn.id);
    addBtn.classList.add('is-hidden');
    addBtn.parentNode
      .querySelector('[data-remove-favorite]')
      .classList.remove('is-hidden');
  }
  const removeBtn = event.target.closest('[data-remove-favorite]');
  if (removeBtn) {
    removeCocktailFromFavorites(removeBtn.id);
    removeBtn.classList.add('is-hidden');
    removeBtn.parentNode
      .querySelector('[data-add-favorite]')
      .classList.remove('is-hidden');
  }
  const detailsBtn = event.target.closest('[data-details]');
  if (detailsBtn) {
    await renderCocktailCard(detailsBtn.id);
  }
  const detailsIngredientBtn = event.target.closest(
    '[data-ingredient-details]'
  );
  if (detailsIngredientBtn) {
    await renderIngredientCard(detailsIngredientBtn.id);
  }
});

const getRandomCoctails = async () => {
  const randomCocktails = await searchRandom();
  const template = getDrinksMarkup(randomCocktails);
  gallery.innerHTML = /*html*/ `
    <h2 class="gallery__title">Cocktails</h2>
    <ul class="gallery__list list">
      ${template.join('')}
    </ul>`;
};

getRandomCoctails();

const provider = new GoogleAuthProvider();
console.log('object :>> ', provider);

const authBtn = document.querySelector('#authBtn');

authBtn.addEventListener('click', () => {
  const auth = getAuth(app);
  auth.languageCode = 'ua';
  console.log('object : ', auth);
  signInWithPopup(auth, provider)
    .then(result => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      console.log('token :>> ', token);
      // The signed-in user info.
      const user = result.user;
      console.log('user :>> ', user);
      const photoURL = user.photoURL;
      authBtn.innerHTML = /*html*/`<img src="${photoURL}" alt="User photo" width="40" height="40"/>`; // ...
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
});

const auth = getAuth();
const user = auth.currentUser;
onAuthStateChanged(auth, user => {
  console.log(user);
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    const photoURL = user.photoURL;
    authBtn.innerHTML = /*html*/`<img src="${photoURL}" alt="User photo" width="40" height="40"/>`;
    // ...
  } else {
    // User is signed out
    // ...
  }
});
