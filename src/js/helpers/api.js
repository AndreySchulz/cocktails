import axios from 'axios';
import { Notify } from 'notiflix';

axios.defaults.baseURL = 'https://www.thecocktaildb.com/api/json/v1/1/';

export const searchCocktails = async cocktailName => {
  const response = await axios.get(`search.php?key=1&s=${cocktailName}`);
  if (response.status >= 400) {
    Notify.failure('Something is wrong...');
    return [];
  } else if (!response.data.drinks) {
    return [];
  }
  return response.data.drinks;
};

export const searchByFirstLetter = async letter => {
  const response = await axios.get(`search.php?key=1&f=${letter}`);
  if (response.status >= 400) {
    Notify.failure('Something is wrong...');
    return [];
  } else if (!response.data.drinks) {
    return [];
  }
  return response.data.drinks;
};

export const searchRandom = async () => {
  let counter = 3;
  const result = [];

  if (window.innerWidth > 767 && window.innerWidth < 1280) {
    counter = 6;
  } else if (window.innerWidth > 1279) {
    counter = 9;
  }

  for (let i = 0; i < counter; i += 1) {
    result.push(axios.get(`random.php`));
  }

  const cocktails = await Promise.all(result);

  const searchDataFromCocktails = cocktails.map(cocktail => {
    return cocktail.data.drinks[0];
  });

  return searchDataFromCocktails;
};

export async function searchById(id) {
  try {
    const response = await axios.get(`lookup.php?i=${id}`);
    return response.data.drinks[0];
  } catch (error) {
    return null;
  }
}

export async function searchIngredientByName(ingredient) {
  try {
    const response = await axios.get(`search.php?i=${ingredient}`);
    return response.data.ingredients[0];
  } catch (error) {
    return null;
  }
}

export async function searchIngredientById(id) {
  try {
    const response = await axios.get(`lookup.php?iid=${id}`);
    return response.data.ingredients[0];
  } catch (error) {
    return null;
  }
}
