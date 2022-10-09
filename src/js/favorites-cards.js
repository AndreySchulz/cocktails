import axios from 'axios';
import { getFavoriteCoctails } from './favorites';

async function searchById(id) {
  try {
    const response = await axios.get(
      `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    return response.data.drinks[0];
  } catch (error) {
    return null;
  }
}

async function showFavoritesCoctails() {
  let list = await Promise.all(getFavoriteCoctails().map(id => searchById(id)));
  list = list.filter(item => item);
  console.log(list);
}

export { showFavoritesCoctails };
