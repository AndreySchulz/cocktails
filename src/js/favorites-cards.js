import { getFavoriteCocktails, getFavoriteIngredients } from './favorites';
import { searchById, searchIngredientById } from './helpers/api';
import { getDrinksMarkup } from './helpers/helpers';
import { getIngredientsMarkup } from './ingredients-modal';

async function showFavoritesCocktails() {
  let list = await Promise.all(getFavoriteCocktails().map(id => searchById(id)));
  list = list.filter(item => item);
  console.log(list);
  const template = getDrinksMarkup(list);
  console.log(template);
  gallery.innerHTML = /*html*/`
    <h2>Favorite cocktails</h2>
    <ul class="gallery__list list">
      ${template.join('')}
    </ul>`;
}

async function showFavoritesIngredients() {
  let list = await Promise.all(getFavoriteIngredients().map(id => searchIngredientById(id)));
  list = list.filter(item => item);
  console.log(list);
  const template = getIngredientsMarkup(list);
  console.log(template);
  gallery.innerHTML = /*html*/`
    <h2>Favorite ingredients</h2>
    <ul class="gallery__list list">
      ${template.join('')}
    </ul>`;
}

export { showFavoritesCocktails, showFavoritesIngredients };
