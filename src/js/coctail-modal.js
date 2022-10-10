import axios from 'axios';
import { searchById } from './favorites-cards';
import { renderIngredientCard } from './ingredients-modal';
import {
  addCocktailToFavorites,
  isCocktailFavorites,
  removeCocktailFromFavorites,
  getCocktailFavoriteBtn,
} from './favorites';
import { createOnClickForModal } from './modal';

const modalCocktailContent = document.querySelector('.modal-cocktail__content');
const backDrop = document.querySelector('#modal-cocktail');

const onClickModal = createOnClickForModal(addCocktailToFavorites, removeCocktailFromFavorites);

backDrop.addEventListener('click', async event => {
  await onClickModal(event);

  const linkIngredient = event.target.closest('[data-ingredient]');
  if (linkIngredient) {
    await renderIngredientCard(linkIngredient.dataset.ingredient);
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
    ${getCocktailFavoriteBtn(idDrink)}
      `;
  modalCocktailContent.innerHTML = markup;
  backDrop.classList.remove('is-hidden');
}

export { renderCocktailCard };
