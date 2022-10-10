import { Notify } from 'notiflix';
import { searchCocktails, searchByFirstLetter } from './helpers/api';
import { getAlphabetMarkup } from './helpers/helpers';
import { addCocktailToFavorites, isCocktailFavorites, removeCocktailFromFavorites } from './js/favorites';
import { showFavoritesCocktails } from './js/favorites-cards';
import { renderCocktailCard } from './js/coctail-modal';

const searchForm = document.querySelector('#form');
const searchField = document.querySelector('#input');
const searchBtn = document.querySelector('#button');
const gallery = document.querySelector('#gallery');
const alphabetUl = document.querySelector('#alphabet');

// console.log(form);

getAlphabetMarkup(alphabetUl);

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const cocktailName = searchField.value.trim();
  if (cocktailName === '') {
    Notify.info('Please enter the name of your cocktail');
    return;
  }
  const drinks = await searchCocktails(cocktailName);

  const template = drinks.map(({ idDrink, strDrink, strDrinkThumb }) => {
    return `<li><a><img src="${strDrinkThumb}" alt="${strDrink}"/><h3>${strDrink}</h3><button id="${idDrink}" data-details>Learn more</button>${getFavoriteBtn(
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
      return `<li><a><img src="${strDrinkThumb}" alt="${strDrink}"/><h3>${strDrink}</h3><button id="${idDrink}" data-details>Learn more</button>${getFavoriteBtn(
        idDrink
      )}</a></li>`;
    });
    gallery.innerHTML = template.join('');
  }
});

gallery.addEventListener('click', async event => {
  const addBtn = event.target.closest('[data-add-favorite]');
  if (addBtn) {
    addCocktailToFavorites(addBtn.id);
    addBtn.classList.add('is-hidden');
    addBtn.parentNode.querySelector('[data-remove-favorite]').classList.remove('is-hidden');
  }
  const removeBtn = event.target.closest('[data-remove-favorite]');
  if (removeBtn) {
    removeCocktailFromFavorites(removeBtn.id);
    removeBtn.classList.add('is-hidden');
    removeBtn.parentNode.querySelector('[data-add-favorite]').classList.remove('is-hidden');
  }
  const detailsBtn = event.target.closest('[data-details]');
  if (detailsBtn) {
    await renderCocktailCard(detailsBtn.id);
  }
});

function getFavoriteBtn(id) {
  return isCocktailFavorites(id)
    ? `<button id="${id}" data-remove-favorite>Remove</button><button id="${id}" class="is-hidden" data-add-favorite>Add to</button>`
    : `<button id="${id}" data-add-favorite>Add to</button><button id="${id}" class="is-hidden" data-remove-favorite>Remove</button>`;
}

// showFavoritesCocktails().then();

