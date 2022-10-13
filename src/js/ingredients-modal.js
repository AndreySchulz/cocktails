import {
  addIngredientsFavorites,
  removeIngredientsFromFavorites,
  getIngredientFavoriteBtn,
  getModalIngredientFavoriteBtn,
} from './favorites';
import { elements as el } from './elements';
import { createOnClickForModal } from './modal';
import { searchIngredientByName } from './helpers/api';
import { disableScroll } from './mobile-nav';

const modalIngredientContent = document.querySelector(
  '.modal-ingredient__content'
);

const onClickModal = createOnClickForModal(
  addIngredientsFavorites,
  removeIngredientsFromFavorites
);

el.backDropModalIngredients.addEventListener('click', onClickModal);

async function renderIngredientCard(ingredient) {
  const {
    idIngredient,
    strIngredient,
    strDescription,
    strType,
    strAlcohol,
    strABV,
  } = await searchIngredientByName(ingredient);
  const markup = /*html*/ `
      <h2 class="content__title">${strIngredient}</h2>
      <h3 class="content__subtitle">${strType || 'No information'}</h3>
      <p class="content__text">${strDescription || 'No information'}</p>
      <ul class="content__list">
        <li class="content__item">✶ Type:	No information</li>
        <li class="content__item">✶ Country of origin: No information</li>
        <li class="content__item">✶ Alcohol by volume: ${strABV}</li>
        <li class="content__item">✶ Flavour:	No information</li>
    </ul>
    ${getModalIngredientFavoriteBtn(idIngredient)}
    `;
  modalIngredientContent.innerHTML = markup;
  el.backDropModalIngredients.classList.remove('is-hidden');
  disableScroll();
}

function getIngredientsMarkup(ingredients) {
  return ingredients.map(
    ({ idIngredient, strIngredient, strType }) => /*html*/ `
    <li class="gallery__item">
      <h2 class="content__title">${strIngredient}</h2>
      <h3 class="content__subtitle">${strType || 'None'}</h3>
      <div class="content__box" data-ingredient-btns>
        <button id="${strIngredient}" class="gallery__button" data-ingredient-details>Learn more</button>
        ${getIngredientFavoriteBtn(idIngredient)}
      </div>
    </li>`
  );
}

export { renderIngredientCard, getIngredientsMarkup };
