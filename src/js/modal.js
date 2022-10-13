import { enableScroll } from './mobile-nav';
const gallery = document.querySelector('#gallery');
const modalCocktailBackDrop = document.querySelector('#modal-cocktail');

function createOnClickForModal(addToFavorites, removeFromFavorites) {
  return async function (event) {
    const backDrop = event.currentTarget;
    if (event.target == backDrop) {
      if (
        modalCocktailBackDrop == backDrop ||
        modalCocktailBackDrop.classList.contains('is-hidden')
      ) {
        enableScroll();
      }
      backDrop.classList.add('is-hidden');
      return;
    }

    const closeBtn = event.target.closest('[data-modal-close]');
    if (closeBtn) {
      if (
        modalCocktailBackDrop == backDrop ||
        modalCocktailBackDrop.classList.contains('is-hidden')
      ) {
        enableScroll();
      }
      backDrop.classList.add('is-hidden');
      return;
    }

    const addFavoriteBtn = event.target.closest('[data-add-favorite]');
    if (addFavoriteBtn) {
      addToFavorites(addFavoriteBtn.id);
      addFavoriteBtn.classList.add('is-hidden');
      addFavoriteBtn.parentNode
        .querySelector('[data-remove-favorite]')
        .classList.remove('is-hidden');

      gallery
        .querySelector(`[id='${addFavoriteBtn.id}'][data-add-favorite]`)
        ?.classList.add('is-hidden');
      gallery
        .querySelector(`[id='${addFavoriteBtn.id}'][data-remove-favorite]`)
        ?.classList.remove('is-hidden');
    }
    const removeFavoriteBtn = event.target.closest('[data-remove-favorite]');
    if (removeFavoriteBtn) {
      removeFromFavorites(removeFavoriteBtn.id);
      removeFavoriteBtn.classList.add('is-hidden');
      removeFavoriteBtn.parentNode
        .querySelector('[data-add-favorite]')
        .classList.remove('is-hidden');

      gallery
        .querySelector(`[id='${removeFavoriteBtn.id}'][data-add-favorite]`)
        ?.classList.remove('is-hidden');
      gallery
        .querySelector(`[id='${removeFavoriteBtn.id}'][data-remove-favorite]`)
        ?.classList.add('is-hidden');
    }
  };
}

export { createOnClickForModal };
