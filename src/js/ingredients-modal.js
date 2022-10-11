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



// async function showFavoritesIngredient() {
//     let list = await Promise.all(getFavoriteCocktails().map(id => searchById(id)));
//     list = list.filter(item => item);
//     console.log(list);
//   }

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
  const markup = `
      <h2 class="content__title">${strIngredient}</h2>
      <h3 class="content__subtitle">${strType}</h3>
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
    ({ idIngredient, strIngredient, strType }) => `
    <h2 class="content__title">${strIngredient}</h2>
    <h3 class="content__subtitle">${strType}</h3>
    <button id="${strIngredient}" class="gallery__button" data-ingredient-details>Learn more</button>
    ${getIngredientFavoriteBtn(idIngredient)}
`
  );
}

export { renderIngredientCard, getIngredientsMarkup };
