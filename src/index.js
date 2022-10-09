import { Notify } from 'notiflix';
import { searchCoctails, searchByFirstLetter } from './helpers/api';
import { getAlphabetMarkup } from './helpers/helpers';
import { addCoctailToFavorites, isCoctailFavorites, removeCoctailFromFavorites } from './js/favorites';
import { showFavoritesCoctails } from './js/favorites-cards';

const searchForm = document.querySelector('#form');
const searchField = document.querySelector('#input');
const searchBtn = document.querySelector('#button');
const gallery = document.querySelector('#gallery');
const alphabetUl = document.querySelector('#alphabet');

// console.log(form);

getAlphabetMarkup(alphabetUl);

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const coctailName = searchField.value.trim();
  if (coctailName === '') {
    Notify.info('Please enter the name of your coctail');
    return;
  }
  const drinks = await searchCoctails(coctailName);

  const template = drinks.map(({ idDrink, strDrink, strDrinkThumb }) => {
    return `<li><a><img src="${strDrinkThumb}" alt="${strDrink}"/><h3>${strDrink}</h3><button>Learn more</button>${getFavoriteBtn(
      idDrink
    )}</a></li>`;
  });
  gallery.innerHTML = template.join('');
});

alphabetUl.addEventListener('click', async event => {
  if (event.target.classList.contains('letterInLi')) {
    const resultLetter = event.target.textContent;
    const drinks = await searchByFirstLetter(resultLetter);

    const template = drinks.map(({ idDrink, strDrink, strDrinkThumb }) => {
      return `<li><a><img src="${strDrinkThumb}" alt="${strDrink}"/><h3>${strDrink}</h3><button>Learn more</button>${getFavoriteBtn(
        idDrink
      )}</a></li>`;
    });
    gallery.innerHTML = template.join('');
  }
});

gallery.addEventListener('click', event => {
  const addBtn = event.target.closest('[data-add-favorite]');
  if (addBtn) {
    addCoctailToFavorites(addBtn.id);
    addBtn.classList.add('is-hidden');
    addBtn.parentNode.querySelector('[data-remove-favorite]').classList.remove('is-hidden');
  }
  const removeBtn = event.target.closest('[data-remove-favorite]');
  if (removeBtn) {
    removeCoctailFromFavorites(removeBtn.id);
    removeBtn.classList.add('is-hidden');
    removeBtn.parentNode.querySelector('[data-add-favorite]').classList.remove('is-hidden');
  }
});

function getFavoriteBtn(id) {
  return isCoctailFavorites(id)
    ? `<button id="${id}" data-remove-favorite>Remove</button><button id="${id}" class="is-hidden" data-add-favorite>Add to</button>`
    : `<button id="${id}" data-add-favorite>Add to</button><button id="${id}" class="is-hidden" data-remove-favorite>Remove</button> `;
}

showFavoritesCoctails().then();

