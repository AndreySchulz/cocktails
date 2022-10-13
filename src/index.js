import { getDatabase } from 'firebase/database';
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
  saveThemeFavorites,
  getFavoriteTheme,
  addIngredientsFavorites,
  removeIngredientsFromFavorites,
} from './js/favorites';
import { renderCocktailCard } from './js/coctail-modal';
import { renderIngredientCard } from './js/ingredients-modal';
import { getCocktailFavoriteBtn } from './js/favorites';
import {
  showFavoritesCocktails,
  showFavoritesIngredients,
} from './js/favorites-cards';

import { onAuthClickCreate } from './js/firebase';

import { openMobileMenu, closeMobileMenu } from './js/mobile-nav';

const mobileSelectEl = document.querySelector('.hero__select');
const searchMobileForm = document.querySelector('#mobile-form');
const searchForm = document.querySelector('#form');
const searchMobileField = document.querySelector('#mobile-input');
const searchField = document.querySelector('#input');
const searchBtn = document.querySelector('#button');
const gallery = document.querySelector('#gallery');
const alphabetUl = document.querySelector('#alphabet');
export const templateWithoutResultText =
  document.querySelector('.gallery__sorry');
templateWithoutResultText.remove();
templateWithoutResultText.style.display = '';
// именно тут закоментил ибо ошибка

const favoriteCocktails = document.querySelector('[data-cocktails]');
const favoriteIngredients = document.querySelector('[data-ingredients]');
const divPagination = document.querySelector('.pagination-markup');
const heroContainer = document.querySelector('.hero');

function showHeroContainer() {
  heroContainer.classList.remove('is-hidden');
}

function hiddenHeroContainer() {
  heroContainer.classList.add('is-hidden');
}

favoriteCocktails.addEventListener('click', event => {
  clearLetters();
  hiddenHeroContainer();
  closeMobileMenu();
  showFavoritesCocktails(event);
});
favoriteIngredients.addEventListener('click', event => {
  clearLetters();
  hiddenHeroContainer();
  closeMobileMenu();
  showFavoritesIngredients(event);
});

getAlphabetMarkup([alphabetUl, mobileSelectEl]);

searchMobileForm.addEventListener('submit', async event => {
  event.preventDefault();

  const cocktailName = searchMobileField.value.trim();
  if (cocktailName === '') {
    Notify.info('Please enter the name of your cocktail');
    return;
  }

  showHeroContainer();
  clearLetters();
  paginateCocktails(searchCocktails, cocktailName);
  event.target.elements[`mobile-input`].value = '';
});

searchForm.addEventListener('submit', async event => {
  event.preventDefault();

  const cocktailName = searchField.value.trim();
  if (cocktailName === '') {
    Notify.info('Please enter the name of your cocktail');
    return;
  }

  showHeroContainer();
  clearLetters();
  paginateCocktails(searchCocktails, cocktailName);
  event.target.elements[`input`].value = '';
});

mobileSelectEl.addEventListener('change', async event => {
  console.log(event.target.value);
  const resultLetter = event.target.value;

  paginateCocktails(searchByFirstLetter, resultLetter);
});

alphabetUl.addEventListener('click', async event => {
  if (event.target.classList.contains('letterInLi')) {
    clearLetters();
    event.target.classList.add('letterInLi--active');
    const resultLetter = event.target.textContent;

    paginateCocktails(searchByFirstLetter, resultLetter);
  }
});

function clearLetters() {
  [...alphabetUl.querySelectorAll('.letterInLi--active')].forEach(item =>
    item.classList.remove('letterInLi--active')
  );
}

gallery.addEventListener('click', async event => {
  const addBtn = event.target.closest('[data-add-favorite]');
  if (addBtn) {
    addBtn.closest('[data-ingredient-btns]')
      ? addIngredientsFavorites(addBtn.id)
      : addCocktailToFavorites(addBtn.id);
    addBtn.classList.add('is-hidden');
    addBtn.parentNode
      .querySelector('[data-remove-favorite]')
      .classList.remove('is-hidden');
  }
  const removeBtn = event.target.closest('[data-remove-favorite]');
  if (removeBtn) {
    removeBtn.closest('[data-ingredient-btns]')
      ? removeIngredientsFromFavorites(removeBtn.id)
      : removeCocktailFromFavorites(removeBtn.id);
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
  let cocktailsPerPage = 3;

  if (window.innerWidth > 767 && window.innerWidth < 1280) {
    cocktailsPerPage = 6;
  } else if (window.innerWidth > 1279) {
    cocktailsPerPage = 9;
  }
  let page = 1;
  const drawCocktails = dataWithAllCocktails => {
    if (!dataWithAllCocktails.length) {
      gallery.innerHTML = '';
      gallery.append(templateWithoutResultText);
    } else {
      if (cocktailsPerPage * (page - 1) >= dataWithAllCocktails.length) return;

      const end = cocktailsPerPage * page;
      const paginatedCocktails = dataWithAllCocktails.slice(0, end);
      gallery.innerHTML = /*html*/ `
        <h2 class="gallery__title">Searching results</h2>
        <ul class="gallery__list list">
          ${getDrinksMarkup(paginatedCocktails).join('')}
        </ul>`;
      page++;
    }
  };

  const handleScroll = async () => {
    const { height: cardHeight } =
      gallery.firstElementChild?.getBoundingClientRect();

    const endOfPage =
      window.innerHeight + window.pageYOffset + cardHeight >=
      document.body.offsetHeight;

    if (endOfPage) {
      console.log('endOfPage :>> ', endOfPage);
      drawCocktails(resultData);
    }
  };

  let throttleWait = false;
  const throttle = (callback, time) => {
    if (throttleWait) return;
    throttleWait = true;

    setTimeout(() => {
      callback();
      throttleWait = false;
    }, time);
  };

  window.addEventListener('scroll', onScroll);
  function onScroll() {
    throttle(handleScroll, 250);
  }

  drawCocktails(resultData, cocktailsPerPage);
}

const boxAuthBtn = document.querySelector('#authBtnLog');
boxAuthBtn.addEventListener('click', onAuthClickCreate(boxAuthBtn));

const burgerBtn = document.querySelector('.header__burger');
const nav = document.querySelector('.header__navigation');

burgerBtn.addEventListener('click', event => {
  if (nav.classList.contains('is-open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

const toggleSwitch = document.querySelector('#switch');
const theme = getFavoriteTheme();
console.log('theme', theme);
switch (theme) {
  case 'Light':
    //
    toggleSwitch.checked = false;
    setLightTheme();
    break;
  case 'Dark':
    //setDarkTheme();
    toggleSwitch.checked = true;
    setDarkTheme();
    break;
}

toggleSwitch.addEventListener('change', event => {
  console.log('change', event);
  event.target.checked ? setDarkTheme() : setLightTheme();
});

function setLightTheme() {
  document.documentElement.style.setProperty('--bg-color', '#FCFCFC');
  document.documentElement.style.setProperty('--bg-text', '#202025');
  saveThemeFavorites('Light');
}
function setDarkTheme() {
  document.documentElement.style.setProperty('--bg-color', '#202025');
  document.documentElement.style.setProperty('--bg-text', '#FCFCFC');
  saveThemeFavorites('Dark');
}
