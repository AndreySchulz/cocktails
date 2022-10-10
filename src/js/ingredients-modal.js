import axios from 'axios';
import {
  addIngredientsFavorites,
  isIngredientsFavorites,
  removeIngredientsFromFavorites,
} from './favorites';

const modalIngredientContent = document.querySelector(
  '.modal-ingredient__content'
);
const backDrop = document.querySelector('#modal-ingredient');

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
  const addFavoriteBtn = event.target.closest('[data-add-favorite]');
  if (addFavoriteBtn) {
    addIngredientsFavorites(addFavoriteBtn.id);
    addFavoriteBtn.classList.add('is-hidden');
    addFavoriteBtn.parentNode
      .querySelector('[data-remove-favorite]')
      .classList.remove('is-hidden');
  }
  const removeFavoriteBtn = event.target.closest('[data-remove-favorite]');
  if (removeFavoriteBtn) {
    removeIngredientsFromFavorites(removeFavoriteBtn.id);
    removeFavoriteBtn.classList.add('is-hidden');
    removeFavoriteBtn.parentNode
      .querySelector('[data-add-favorite]')
      .classList.remove('is-hidden');
  }
});

async function searchIngredientByName(ingredient) {
  try {
    const response = await axios.get(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${ingredient}`
    );
    return response.data.ingredients[0];
  } catch (error) {
    return null;
  }
}

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
    ${getFavoriteBtn(idIngredient)}
    `;
  modalIngredientContent.innerHTML = markup;
  backDrop.classList.remove('is-hidden');
}

function getFavoriteBtn(id) {
  return isIngredientsFavorites(id)
    ? `<button id="${id}" data-remove-favorite>Remove</button><button id="${id}" class="is-hidden" data-add-favorite>Add to</button>`
    : `<button id="${id}" data-add-favorite>Add to</button><button id="${id}" class="is-hidden" data-remove-favorite>Remove</button>`;
}

export { renderIngredientCard };
