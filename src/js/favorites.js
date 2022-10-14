import { getDatabase, ref, set, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase';

const FAVORITE_COCTAILS_KEY = 'favorite-cocktails';
const FAVORITE_INGREDIENTS_KEY = 'favorite-ingredients';
const FAVORITE_THEME = 'favorite-theme';
const Cache = {
  [FAVORITE_COCTAILS_KEY]: getFavoriteFromLocalStorage(FAVORITE_COCTAILS_KEY),
  [FAVORITE_INGREDIENTS_KEY]: getFavoriteFromLocalStorage(
    FAVORITE_INGREDIENTS_KEY
  ),
  [FAVORITE_THEME]: getFavoriteThemeFromLocalStorage(FAVORITE_THEME) || 'Light',
};
const galleryIconBtn = document.querySelector('.gallery__icon-btn');
galleryIconBtn.remove();
galleryIconBtn.style.display = '';

let userId;
const auth = getAuth(app);
onAuthStateChanged(auth, user => {
  if (user) {
    userId = user.uid;
    onReadData(FAVORITE_COCTAILS_KEY);
    onReadData(FAVORITE_INGREDIENTS_KEY);
  } else {
    userId = null;
  }
});

const db = getDatabase();
function writeFavoriteData(favoriteKey, favorites) {
  if (userId) {
    set(ref(db, `${userId}/${favoriteKey}`), favorites);
  }
}

function onReadData(favoriteKey) {
  const starCountRef = ref(db, `${userId}/${favoriteKey}`);
  onValue(starCountRef, snapshot => {
    const data = snapshot.val();
    Cache[favoriteKey] = data;
  });
}
function getFavoriteFromLocalStorage(favoriteKey) {
  const cocktailsString = localStorage.getItem(favoriteKey) || '[]';
  const localResult = JSON.parse(cocktailsString);
  return localResult;
}
function getFavoriteThemeFromLocalStorage(favoriteKey) {
  return localStorage.getItem(favoriteKey) || 'Light';
}
function getFavoriteTheme() {
  if (Cache && Cache[FAVORITE_THEME]) {
    return Cache[FAVORITE_THEME];
  }
  return getFavoriteThemeFromLocalStorage(FAVORITE_THEME);
}

function getFavorite(favoriteKey) {
  if (Cache && Cache[favoriteKey]) {
    return Cache[favoriteKey];
  }
  return getFavoriteFromLocalStorage(favoriteKey);
}
function getFavoriteCocktails() {
  return getFavorite(FAVORITE_COCTAILS_KEY);
}
function getFavoriteIngredients() {
  return getFavorite(FAVORITE_INGREDIENTS_KEY);
}
function getFavoriteTheme() {
  return getFavorite(FAVORITE_THEME);
}

function addToFavorites(favoriteKey, id) {
  try {
    const favorites = getFavorite(favoriteKey);
    if (favorites.indexOf(id) != -1) return;
    Cache[favoriteKey] = [...favorites, id];
    localStorage.setItem(favoriteKey, JSON.stringify(Cache[favoriteKey]));
    writeFavoriteData(favoriteKey, Cache[favoriteKey]);
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
function saveThemeFavorites(theme) {
  try {
    Cache[FAVORITE_THEME] = theme;
    localStorage.setItem(FAVORITE_THEME, Cache[FAVORITE_THEME]);
    writeFavoriteData(FAVORITE_THEME, Cache[FAVORITE_THEME]);
  } catch (error) {
    console.error('Set state error: ', error.message);
  }
}

function getFavoriteBtn(favoriteKey, id) {
  return isFavorites(favoriteKey, id)
    ? /*html*/ `<button data-id="${id}" class="gallery__favorite" data-remove-favorite>
      Remove ${galleryIconBtn.outerHTML}
      </button><button data-id="${id}" class="gallery__favorite is-hidden" data-add-favorite>
      Add to ${galleryIconBtn.outerHTML}
      </button>`
    : /*html*/ `<button data-id="${id}" class="gallery__favorite" data-add-favorite>
      Add to ${galleryIconBtn.outerHTML}
      </button><button data-id="${id}" class="gallery__favorite is-hidden" data-remove-favorite>
      Remove ${galleryIconBtn.outerHTML}
      </button>`;
}

function getModalFavoriteBtn(favoriteKey, id) {
  return isFavorites(favoriteKey, id)
    ? /*html*/ `<button data-id="${id}" class="gallery__modal-button" data-remove-favorite>
      Remove from favorite
      </button><button data-id="${id}" class="gallery__modal-button is-hidden" data-add-favorite>
      Add to favorite 
      </button>`
    : /*html*/ `<button data-id="${id}" class="gallery__modal-button" data-add-favorite>
      Add to favorite
      </button><button data-id="${id}" class="gallery__modal-button is-hidden" data-remove-favorite>
      Remove from favorite
      </button>`;
}

function getCocktailFavoriteBtn(id) {
  return getFavoriteBtn(FAVORITE_COCTAILS_KEY, id);
}
function getModalCocktailFavoriteBtn(id) {
  return getModalFavoriteBtn(FAVORITE_COCTAILS_KEY, id);
}
function getIngredientFavoriteBtn(id) {
  return getFavoriteBtn(FAVORITE_INGREDIENTS_KEY, id);
}
function getModalIngredientFavoriteBtn(id) {
  return getModalFavoriteBtn(FAVORITE_INGREDIENTS_KEY, id);
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
  Cache[favoriteKey] = favorites;
  localStorage.setItem(favoriteKey, JSON.stringify(Cache[favoriteKey]));
  writeFavoriteData(favoriteKey, Cache[favoriteKey]);
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
  getModalCocktailFavoriteBtn,
  getFavoriteTheme,
  saveThemeFavorites,
  getModalIngredientFavoriteBtn,
};
