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
} from './js/favorites';
import { renderCocktailCard } from './js/coctail-modal';
import { renderIngredientCard } from './js/ingredients-modal';
import { getCocktailFavoriteBtn } from './js/favorites';
import {
  showFavoritesCocktails,
  showFavoritesIngredients,
} from './js/favorites-cards';

import { onAuthClickCreate } from './js/firebase';

const mobileSelectEl = document.querySelector('.hero__select');
const searchMobileForm = document.querySelector('#mobile-form');
const searchForm = document.querySelector('#form');
const searchMobileField = document.querySelector('#mobile-input');
const searchField = document.querySelector('#input');
const searchBtn = document.querySelector('#button');
const gallery = document.querySelector('#gallery');
const alphabetUl = document.querySelector('#alphabet');
const templateWithoutResultText = document.querySelector('.gallery__sorry');
templateWithoutResultText.remove();
templateWithoutResultText.classList.remove('is-hidden');
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
  showFavoritesCocktails(event);
});
favoriteIngredients.addEventListener('click', event => {
  clearLetters();
  hiddenHeroContainer();
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

  // gallery.innerHTML = /*html*/ `
  //     <h2 class="gallery__title">Searching results</h2>
  //     <ul class="gallery__list list">
  //       ${template.join('')}
  //     </ul>`;
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
      <h2 class="gallery__title">Searching results</h2>
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

const authBtn = document.querySelector('#authBtn');
const boxAuthBtn = document.querySelector('#authBtnLog');
boxAuthBtn.addEventListener('click', onAuthClickCreate(boxAuthBtn));

const burgerBtn = document.querySelector('.header__burger');
const nav = document.querySelector('.header__navigation');

burgerBtn.addEventListener('click', event => {
  if (nav.classList.contains('is-open')) {
    nav.classList.remove('is-open');
    burgerBtn.firstElementChild.style.display = '';
    burgerBtn.lastElementChild.style.display = 'none';
  } else {
    nav.classList.add('is-open');
    burgerBtn.firstElementChild.style.display = 'none';
    burgerBtn.lastElementChild.style.display = '';
  }
});
