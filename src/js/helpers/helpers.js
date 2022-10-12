import { getCocktailFavoriteBtn } from '../favorites';

const alphabet = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  0,
];

export const getAlphabetMarkup = targetElement => {
  const template = alphabet.map(item => {
    return `<li><span class="letterInLi">${item}</span></li>`;
  });
  targetElement.innerHTML = template.join('');
};

export const getDrinksMarkup = drinks => {
  const template = drinks.map(({ idDrink, strDrink, strDrinkThumb }) => {
    return /*html*/ `
    <li class="gallery__item">
      <img class="gallery__img" src="${strDrinkThumb}" alt="${strDrink}"/>
      <div class="gallery__box">
        <h3 class="gallery__text">${strDrink}</h3>
        <div>
          <button id="${idDrink}" class="gallery__button" data-details>Learn more</button>
          ${getCocktailFavoriteBtn(idDrink)}
        </div>
      </div>
    </li>`;
  });
  return template;
};