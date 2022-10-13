import {
  addIngredientsFavorites,
  removeIngredientsFromFavorites,
  getIngredientFavoriteBtn,
} from './favorites';
import { createOnClickForModal } from './modal';
import { searchIngredientByName, searchById } from './helpers/api';

const modalIngredientContent = document.querySelector(
  '.modal-ingredient__content'
);
const backDrop = document.querySelector('#modal-ingredient');

const onClickModal = createOnClickForModal(
  addIngredientsFavorites,
  removeIngredientsFromFavorites
);

backDrop.addEventListener('click', onClickModal);

async function renderIngredientCard(ingredient) {
  console.log(ingredient);
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
      <h3 class="content__subtitle">${strType || 'None'}</h3>
      <p class="content__text">${strDescription}</p>
      <ul class="content__list">
        <li class="content__item">Type:	</li>
        <li class="content__item">Country of origin: </li>
        <li class="content__item">Alcohol by volume: ${strABV}</li>
        <li class="content__item">Flavour:	</li>
    </ul>
    ${getIngredientFavoriteBtn(idIngredient)}
    `;
  modalIngredientContent.innerHTML = markup;
  backDrop.classList.remove('is-hidden');
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
