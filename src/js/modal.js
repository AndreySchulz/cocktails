import { enableScroll } from './mobile-nav';
import { elements as el } from './elements';

document.documentElement.addEventListener('keydown', event => {
  if (event.code === 'Escape') {
    if (!el.backDropModalIngredients.classList.contains('is-hidden')) {
      el.backDropModalIngredients.classList.add('is-hidden');
      if (el.modalCocktailBackDrop.classList.contains('is-hidden')) {
        enableScroll();
      }
    } else if (!el.modalCocktailBackDrop.classList.contains('is-hidden')) {
      el.modalCocktailBackDrop.classList.add('is-hidden');
      enableScroll();
    }
  }
});

function createOnClickForModal(addToFavorites, removeFromFavorites) {
  return async function (event) {
    const backDrop = event.currentTarget;
    if (event.target == backDrop) {
      if (
        el.modalCocktailBackDrop == backDrop ||
        el.modalCocktailBackDrop.classList.contains('is-hidden')
      ) {
        enableScroll();
      }
      backDrop.classList.add('is-hidden');
      return;
    }

    const closeBtn = event.target.closest('[data-modal-close]');
    if (closeBtn) {
      if (
        el.modalCocktailBackDrop == backDrop ||
        el.modalCocktailBackDrop.classList.contains('is-hidden')
      ) {
        enableScroll();
      }
      backDrop.classList.add('is-hidden');
      return;
    }

    const addFavoriteBtn = event.target.closest('[data-add-favorite]');
    if (addFavoriteBtn) {
      addToFavorites(addFavoriteBtn.dataset.id);
      addFavoriteBtn.classList.add('is-hidden');
      addFavoriteBtn.parentNode
        .querySelector('[data-remove-favorite]')
        .classList.remove('is-hidden');

      el.gallery
        .querySelector(
          `[data-id='${addFavoriteBtn.dataset.id}'][data-add-favorite]`
        )
        ?.classList.add('is-hidden');
      el.gallery
        .querySelector(
          `[data-id='${addFavoriteBtn.dataset.id}'][data-remove-favorite]`
        )
        ?.classList.remove('is-hidden');
    }
    const removeFavoriteBtn = event.target.closest('[data-remove-favorite]');
    if (removeFavoriteBtn) {
      removeFromFavorites(removeFavoriteBtn.dataset.id);
      removeFavoriteBtn.classList.add('is-hidden');
      removeFavoriteBtn.parentNode
        .querySelector('[data-add-favorite]')
        .classList.remove('is-hidden');

      el.gallery
        .querySelector(
          `[data-id='${removeFavoriteBtn.dataset.id}'][data-add-favorite]`
        )
        ?.classList.remove('is-hidden');
      el.gallery
        .querySelector(
          `[data-id='${removeFavoriteBtn.dataset.id}'][data-remove-favorite]`
        )
        ?.classList.add('is-hidden');
    }
  };
}

export { createOnClickForModal };
