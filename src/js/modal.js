function createOnClickForModal(addToFavorites, removeFromFavorites) {
    return async  function(event) {
        const backDrop = event.currentTarget;
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
            addToFavorites(addFavoriteBtn.id);
            addFavoriteBtn.classList.add('is-hidden');
            addFavoriteBtn.parentNode
              .querySelector('[data-remove-favorite]')
              .classList.remove('is-hidden');
          }
          const removeFavoriteBtn = event.target.closest('[data-remove-favorite]');
          if (removeFavoriteBtn) {
            removeFromFavorites(removeFavoriteBtn.id);
            removeFavoriteBtn.classList.add('is-hidden');
            removeFavoriteBtn.parentNode
              .querySelector('[data-add-favorite]')
              .classList.remove('is-hidden');
          }
    }
}

export { createOnClickForModal };