import {
  addCocktailToFavorites,
  removeCocktailFromFavorites,
  saveThemeFavorites,
  getFavoriteTheme,
  addIngredientsFavorites,
  removeIngredientsFromFavorites,
} from './favorites';
import { renderCocktailCard } from './coctail-modal';
import { renderIngredientCard } from './ingredients-modal';

export async function clickGallery(event) {
  const addBtn = event.target.closest('[data-add-favorite]');
  if (addBtn) {
    addBtn.closest('[data-ingredient-btns]')
      ? addIngredientsFavorites(addBtn.id)
      : addCocktailToFavorites(addBtn.id);
    addBtn.classList.add('is-hidden');
    addBtn.parentNode
      .querySelector('[data-remove-favorite]')
      .classList.remove('is-hidden');
  }
  const removeBtn = event.target.closest('[data-remove-favorite]');
  if (removeBtn) {
    removeBtn.closest('[data-ingredient-btns]')
      ? removeIngredientsFromFavorites(removeBtn.id)
      : removeCocktailFromFavorites(removeBtn.id);
    removeBtn.classList.add('is-hidden');
    removeBtn.parentNode
      .querySelector('[data-add-favorite]')
      .classList.remove('is-hidden');
  }
  const detailsBtn = event.target.closest('[data-details]');
  if (detailsBtn) {
    await renderCocktailCard(detailsBtn.id);
  }
  const detailsIngredientBtn = event.target.closest(
    '[data-ingredient-details]'
  );
  if (detailsIngredientBtn) {
    await renderIngredientCard(detailsIngredientBtn.id);
  }
}
