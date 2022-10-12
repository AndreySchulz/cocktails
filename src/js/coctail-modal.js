import { searchById } from './helpers/api';
import { renderIngredientCard } from './ingredients-modal';
import {
  addCocktailToFavorites,
  removeCocktailFromFavorites,
  getModalCocktailFavoriteBtn,
} from './favorites';
import { createOnClickForModal } from './modal';

const modalCocktailContent = document.querySelector('.modal-cocktail__content');
const backDrop = document.querySelector('#modal-cocktail');

const onClickModal = createOnClickForModal(
  addCocktailToFavorites,
  removeCocktailFromFavorites
);

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

  const markup = /*html*/ `
      <div class="modal-header">
        <img class="modal-header__img" src="${strDrinkThumb}" alt="${strDrink}" loading="lazy" width="280" height="280" />
        <div class="modal-header__heading">
          <h2 class="modal-header__title">${strDrink}</h2>
          <h3 class="modal-header__subtitle">instractions:</h3>
          <p class="modal-header__text">Per cocktail</p>
          <ul class="modal-header__list">
            ${ingredients
              .map(
                item =>
                  `<li class="modal-header__item">
                    <a href="#" class="modal-header__link" data-ingredient="${item}">✶ ${item}</a>
                  </li>`
              )
              .join('')}
          </ul>
        </div>
      </div>
      <div class="modal-header">
      <h3 class="modal-header__subtitle">ingredients</h3>
      <p class="modal-header__text">${strInstructions}</p>
      </div>
      ${getModalCocktailFavoriteBtn(idDrink)}
       `;
  modalCocktailContent.innerHTML = markup;
  backDrop.classList.remove('is-hidden');
}

export { renderCocktailCard };
