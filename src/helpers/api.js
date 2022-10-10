import axios from "axios"
import { Notify } from "notiflix";

export const searchCocktails = async (cocktailName) => {
const response  = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?key=1&s=${cocktailName}`)
// console.log(response);
if (response.status >= 400) {
    Notify.failure("Something is wrong...")
    return [];
} else if (!response.data.drinks) {
    Notify.warning("There's no drink with such name");
    return [];
}
return response.data.drinks;
}

export const searchByFirstLetter = async (letter) => {
    const response  = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?key=1&f=${letter}`)
console.log(response);
if (response.status >= 400) {
    Notify.failure("Something is wrong...")
    return [];
} else if (!response.data.drinks) {
    Notify.warning("There's no drink with such name");
    return [];
}
return response.data.drinks;
}
