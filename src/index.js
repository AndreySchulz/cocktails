// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
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
import { getRenderLogin, renderUser } from './js/get-login-render';

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

const searchMobileForm = document.querySelector('#mobile-form');
const searchForm = document.querySelector('#form');
const searchMobileField = document.querySelector('#mobile-input');
const searchField = document.querySelector('#input');
const searchBtn = document.querySelector('#button');
const gallery = document.querySelector('#gallery');
const alphabetUl = document.querySelector('#alphabet');
const templateWithoutResultText = document.querySelector('.gallery__sorry');
// templateWithoutResultText.remove();
// templateWithoutResultText.classList.remove('is-hidden');
// именно тут закоментил ибо ошибка

const favoriteCocktails = document.querySelector('[data-cocktails]');
const favoriteIngredients = document.querySelector('[data-ingredients]');
const divPagination = document.querySelector('.pagination-markup');

favoriteCocktails.addEventListener('click', showFavoritesCocktails);
favoriteIngredients.addEventListener('click', showFavoritesIngredients);

getAlphabetMarkup(alphabetUl);

searchMobileForm.addEventListener('submit', async event => {
  event.preventDefault();

  const cocktailName = searchMobileField.value.trim();
  if (cocktailName === '') {
    Notify.info('Please enter the name of your cocktail');
    return;
  }

  paginateCocktails(searchCocktails, cocktailName);
});

searchForm.addEventListener('submit', async event => {
  event.preventDefault();

  const cocktailName = searchField.value.trim();
  if (cocktailName === '') {
    Notify.info('Please enter the name of your cocktail');
    return;
  }

  paginateCocktails(searchCocktails, cocktailName);

  gallery.innerHTML = /*html*/ `
      <h2 class="gallery__title">Searching results</h2>
      <ul class="gallery__list list">
        ${template.join('')}
      </ul>`;
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

async function paginateCocktails(getData, params) {
  const resultData = await getData(params);
  let currentPage = 1;
  let cocktails = 3;

  if (window.innerWidth > 767 && window.innerWidth < 1280) {
    cocktails = 6;
  } else if (window.innerWidth > 1279) {
    cocktails = 9;
  }

  const drawCocktails = (dataWithAllCocktails, cocktailsPerPage, page) => {
    if (!dataWithAllCocktails.length) {
      gallery.innerHTML = '';
      gallery.append(templateWithoutResultText);
    } else {
      page -= 1;

      const start = cocktailsPerPage * page;
      const end = start + cocktailsPerPage;
      const paginatedCocktails = dataWithAllCocktails.slice(start, end);
      gallery.innerHTML = /*html*/ `
      <h2>Searching results</h2>
      <ul class="gallery__list list">
        ${getDrinksMarkup(paginatedCocktails).join('')}
      </ul>`;
    }
  };

  const displayPaginationBtn = page => {
    const paginationItem = document.createElement('li');
    paginationItem.classList.add('pagination-item');
    paginationItem.innerText = page;

    if (currentPage === page) {
      paginationItem.classList.add('pagination-item-active');
    }

    paginationItem.addEventListener('click', () => {
      currentPage = page;
      drawCocktails(resultData, cocktails, currentPage);

      let currentItemLi = document.querySelector('.pagination-item-active');
      currentItemLi.classList.remove('pagination-item-active');

      paginationItem.classList.add('pagination-item-active');
    });
    return paginationItem;
  };

  const displayPagination = (dataWithAllCocktails, cocktailsPerPage) => {
    const numberOfPages = Math.ceil(
      dataWithAllCocktails.length / cocktailsPerPage
    );

    const ulPaginationBtns = document.createElement('ul');
    ulPaginationBtns.classList.add('pagination-list');

    for (let i = 1; i <= numberOfPages; i += 1) {
      const oneBtn = displayPaginationBtn(i);
      ulPaginationBtns.appendChild(oneBtn);
    }
    divPagination.innerHTML = '';
    divPagination.appendChild(ulPaginationBtns);
  };
  drawCocktails(resultData, cocktails, currentPage);
  displayPagination(resultData, cocktails);
}

const provider = new GoogleAuthProvider();
console.log('object :>> ', provider);

const authBtn = document.querySelector('#authBtn');
const boxAuthBtn = document.querySelector('#authBtnLog');
console.log('authBtn :>> ', authBtn);
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
      renderUser(user, authBtn, boxAuthBtn);
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
});

const auth = getAuth();
const user = auth.currentUser;
onAuthStateChanged(auth, user => {
  console.log(user);
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
