const FAVORITE_COCTAILS_KEY = 'favorite-cocktails';
const FAVORITE_INGREDIENTS_KEY = 'favorite-ingredients';

function getFavorite(favoriteKey) {
  const cocktailsString = localStorage.getItem(favoriteKey) || '[]';
  return JSON.parse(cocktailsString);
}
function getFavoriteCocktails() {
  return getFavorite(FAVORITE_COCTAILS_KEY);
}
function getFavoriteIngredients() {
  return getFavorite(FAVORITE_INGREDIENTS_KEY);
}

function addToFavorites(favoriteKey, id) {
  try {
    const favorites = getFavorite(favoriteKey);
    if (favorites.indexOf(id) != -1) return;
    localStorage.setItem(favoriteKey, JSON.stringify([...favorites, id]));
  } catch (error) {
    console.error('Set state error: ', error.message);
  }
}

function addCocktailToFavorites(id) {
  addToFavorites(FAVORITE_COCTAILS_KEY, id);
}

function addIngredientsFavorites(id) {
  addToFavorites(FAVORITE_INGREDIENTS_KEY, id);
}

function getFavoriteBtn(favoriteKey, id) {
  return isFavorites(favoriteKey, id)
    ? /*html*/ `<button id="${id}" class="gallery__favorite" data-remove-favorite>Remove</button><button id="${id}" class="gallery__favorite is-hidden" data-add-favorite>Add to</button>`
    : /*html*/ `<button id="${id}" class="gallery__favorite" data-add-favorite>Add to</button><button id="${id}" class="gallery__favorite is-hidden" data-remove-favorite>Remove</button>`;
}
function getCocktailFavoriteBtn(id) {
  return getFavoriteBtn(FAVORITE_COCTAILS_KEY, id);
}
function getIngredientFavoriteBtn(id) {
  return getFavoriteBtn(FAVORITE_INGREDIENTS_KEY, id);
}

function isFavorites(favoriteKey, id) {
  const favorites = getFavorite(favoriteKey);
  return favorites.indexOf(id) != -1 ? true : false;
}

function isCocktailFavorites(id) {
  return isFavorites(FAVORITE_COCTAILS_KEY, id);
}

function isIngredientsFavorites(id) {
  return isFavorites(FAVORITE_INGREDIENTS_KEY, id);
}

function removeFromFavorites(favoriteKey, id) {
  const favorites = getFavorite(favoriteKey);
  const index = favorites.indexOf(id);
  if (index == -1) return;
  favorites.splice(index, 1);
  localStorage.setItem(favoriteKey, JSON.stringify(favorites));
}

function removeCocktailFromFavorites(id) {
  removeFromFavorites(FAVORITE_COCTAILS_KEY, id);
}

function removeIngredientsFromFavorites(id) {
  removeFromFavorites(FAVORITE_INGREDIENTS_KEY, id);
}

export {
  addCocktailToFavorites,
  isCocktailFavorites,
  removeCocktailFromFavorites,
  getFavoriteCocktails,
  getFavoriteIngredients,
  addIngredientsFavorites,
  isIngredientsFavorites,
  removeIngredientsFromFavorites,
  getCocktailFavoriteBtn,
  getIngredientFavoriteBtn,
};
