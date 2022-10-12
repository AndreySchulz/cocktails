import { getFavoriteCocktails, getFavoriteIngredients } from './favorites';
import { searchById, searchIngredientById } from './helpers/api';
import { getDrinksMarkup } from './helpers/helpers';
import { getIngredientsMarkup } from './ingredients-modal';
import { templateWithoutResultText } from '../index';

async function showFavoritesCocktails() {
  let list = await Promise.all(
    getFavoriteCocktails().map(id => searchById(id))
  );
  list = list.filter(item => item);
  console.log(list);
  const template = getDrinksMarkup(list);

  gallery.innerHTML = /*html*/ `
    <h2 class="gallery__title">Favorite cocktails</h2>
    ${
      template?.length
        ? `<ul class="gallery__list list">${template.join('')}</ul>`
        : templateWithoutResultText.outerHTML
    }`;
}

async function showFavoritesIngredients() {
  let list = await Promise.all(
    getFavoriteIngredients().map(id => searchIngredientById(id))
  );
  list = list.filter(item => item);
  console.log(list);
  const template = getIngredientsMarkup(list);
  
  gallery.innerHTML = /*html*/ `
    <h2 class="gallery__title">Favorite ingredients</h2>
    ${
      template?.length
    ? `<ul class="gallery__list list">${template.join('')}</ul>`
    : templateWithoutResultText.outerHTML
    }`;
}

export { showFavoritesCocktails, showFavoritesIngredients };
