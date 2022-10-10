import { getFavoriteBtn } from"../../index";

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];


export const getAlphabetMarkup = (targetElement) => {
    const template = alphabet.map(item => {
        return `<li><span class="letterInLi">${item}</span></li>`
    })
    targetElement.innerHTML = template.join("");

}

export const getDrinksMarkup = (drinks) => {
    const template = drinks.map(({ idDrink, strDrink, strDrinkThumb }) => {
        return `<li><a><img src="${strDrinkThumb}" alt="${strDrink}"/><h3>${strDrink}</h3><button id="${idDrink}" data-details>Learn more</button>${getFavoriteBtn(
          idDrink
        )}</a></li>`;
      });
    return template;
}

