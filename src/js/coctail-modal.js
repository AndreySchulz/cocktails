import axios from 'axios';
import { searchById } from './favorites-cards';
import { renderIngredientCard } from './ingredients-modal';
import {
  addCocktailToFavorites,
  isCocktailFavorites,
  removeCocktailFromFavorites,
} from './favorites';

const modalCocktailContent = document.querySelector('.modal-cocktail__content');
const backDrop = document.querySelector('#modal-cocktail');

backDrop.addEventListener('click', async event => {
  if (event.target == backDrop) {
    backDrop.classList.add('is-hidden');
    return;
  }
  const closeBtn = event.target.closest('[data-modal-close]');
  if (closeBtn) {
    backDrop.classList.add('is-hidden');
    return;
  }
  const linkIngredient = event.target.closest('[data-ingredient]');
  if (linkIngredient) {
    await renderIngredientCard(linkIngredient.dataset.ingredient);
  }
  const addFavoriteBtn = event.target.closest('[data-add-favorite]');
  if (addFavoriteBtn) {
    addCocktailToFavorites(addFavoriteBtn.id);
    addFavoriteBtn.classList.add('is-hidden');
    addFavoriteBtn.parentNode
      .querySelector('[data-remove-favorite]')
      .classList.remove('is-hidden');
  }
  const removeFavoriteBtn = event.target.closest('[data-remove-favorite]');
  if (removeFavoriteBtn) {
    removeCocktailFromFavorites(removeFavoriteBtn.id);
    removeFavoriteBtn.classList.add('is-hidden');
    removeFavoriteBtn.parentNode
      .querySelector('[data-add-favorite]')
      .classList.remove('is-hidden');
  }
});

async function renderCocktailCard(id) {
  const {
    idDrink,
    strDrink,
    strInstructions,
    strDrinkThumb,
    strIngredient1,
    strIngredient2,
    strIngredient3,
    strIngredient4,
    strIngredient5,
    strIngredient6,
    strIngredient7,
    strIngredient8,
    strIngredient9,
    strIngredient10,
    strIngredient11,
    strIngredient12,
    strIngredient13,
    strIngredient14,
    strIngredient15,
  } = await searchById(id);
  const ingredients = [
    strIngredient1,
    strIngredient2,
    strIngredient3,
    strIngredient4,
    strIngredient5,
    strIngredient6,
    strIngredient7,
    strIngredient8,
    strIngredient9,
    strIngredient10,
    strIngredient11,
    strIngredient12,
    strIngredient13,
    strIngredient14,
    strIngredient15,
  ].filter(item => item);

  const markup = `
      <h2 class="content__title">${strDrink}</h2>
      <h3 class="content__subtitle">instractions:</h3>
      <p class="content__text">${strInstructions}</p>
      <img class="" src="${strDrinkThumb}" alt="${strDrink}" loading="lazy" width="280" height="280" />
      <h3 class="content__subtitle">ingredients</h3>
      <p class="content__label">per cocktail</p>
      <ul class="content__list">
     ${ingredients
       .map(
         item =>
           `<li class="content__item"><a href="#" class="content__link" data-ingredient="${item}">${item}</a></li>`
       )
       .join('')}
    </ul>
    ${getFavoriteBtn(idDrink)}
      `;
  modalCocktailContent.innerHTML = markup;
  backDrop.classList.remove('is-hidden');
}

function getFavoriteBtn(id) {
  return isCocktailFavorites(id)
    ? `<button id="${id}" data-remove-favorite>Remove</button><button id="${id}" class="is-hidden" data-add-favorite>Add to</button>`
    : `<button id="${id}" data-add-favorite>Add to</button><button id="${id}" class="is-hidden" data-remove-favorite>Remove</button>`;
}

export { renderCocktailCard };
