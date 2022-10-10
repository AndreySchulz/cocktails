import axios from 'axios';
import { getFavoriteCocktails } from './favorites';

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

async function showFavoritesCocktails() {
  let list = await Promise.all(getFavoriteCocktails().map(id => searchById(id)));
  list = list.filter(item => item);
  console.log(list);
}

export { showFavoritesCocktails, searchById };
