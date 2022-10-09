const FAVORITE_COCTAILS_KEY = 'favorite-coctails';

function getFavoriteCoctails() {
    const coctailsString = localStorage.getItem(FAVORITE_COCTAILS_KEY) || '[]';
    return JSON.parse(coctailsString);
}

function addCoctailToFavorites(id) {
  console.log('add', id);
  try {
    const coctails = getFavoriteCoctails();
    if(coctails.indexOf(id) != -1) return;
    localStorage.setItem(FAVORITE_COCTAILS_KEY, JSON.stringify([...coctails, id]));
  } catch (error) {
    console.error("Set state error: ", error.message);
  }
}

function isCoctailFavorites(id) {
    const coctails = getFavoriteCoctails();
    return coctails.indexOf(id) != -1 ? true : false;
}

function removeCoctailFromFavorites(id) {
    console.log('remove', id);
    const coctails = getFavoriteCoctails();
    const index = coctails.indexOf(id);
    if(index == -1) return;
    coctails.splice(index, 1);
    localStorage.setItem(FAVORITE_COCTAILS_KEY, JSON.stringify(coctails));
}

export { addCoctailToFavorites, isCoctailFavorites, removeCoctailFromFavorites, getFavoriteCoctails };
