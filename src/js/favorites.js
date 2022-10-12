import { getDatabase, ref, set, onValue } from 'firebase/database';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { app } from './firebase';

const FAVORITE_COCTAILS_KEY = 'favorite-cocktails';
const FAVORITE_INGREDIENTS_KEY = 'favorite-ingredients';
const Cache = {
  [FAVORITE_COCTAILS_KEY]: getFavoriteFromLocalStorage(FAVORITE_COCTAILS_KEY),
  [FAVORITE_INGREDIENTS_KEY]: getFavoriteFromLocalStorage(FAVORITE_INGREDIENTS_KEY),
};
console.log(Cache);
let userId;
const auth = getAuth(app);
onAuthStateChanged(auth, user => {
  console.log(user);
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
  set(ref(db, `${userId}/${favoriteKey}`), favorites);
}

function onReadData(favoriteKey) {
  const starCountRef = ref(db, `${userId}/${favoriteKey}`);
  onValue(starCountRef, snapshot => {
    const data = snapshot.val();
    console.log('on value', data);
    Cache[favoriteKey] = data;
  });
}
function getFavoriteFromLocalStorage(favoriteKey){
  const cocktailsString = localStorage.getItem(favoriteKey) || '[]';
  const localResult = JSON.parse(cocktailsString);
  return localResult;
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

function getFavoriteBtn(favoriteKey, id) {
  return isFavorites(favoriteKey, id)
    ? /*html*/ `<button id="${id}" class="gallery__button" data-remove-favorite>Remove</button><button id="${id}" class="gallery__button is-hidden" data-add-favorite>Add to</button>`
    : /*html*/ `<button id="${id}" class="gallery__button" data-add-favorite>Add to</button><button id="${id}" class="gallery__button is-hidden" data-remove-favorite>Remove</button>`;
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
  Cache[favoriteKey] = favorites;
  localStorage.setItem(favoriteKey, JSON.stringify(Cache[favoriteKey]));
  writeFavoriteData(Cache[favoriteKey]);
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
