import { Notify } from 'notiflix';
import {
  searchCocktails,
  searchByFirstLetter,
  searchRandom,
} from './js/helpers/api';
import { getAlphabetMarkup, getDrinksMarkup } from './js/helpers/helpers';
import {
  addCocktailToFavorites,
  removeCocktailFromFavorites,
} from './js/favorites';
import { renderCocktailCard } from './js/coctail-modal';
import { renderIngredientCard } from './js/ingredients-modal';
import { getCocktailFavoriteBtn } from './js/favorites';
import { showFavoritesCocktails, showFavoritesIngredients } from './js/favorites-cards';

const searchForm = document.querySelector('#form');
const searchField = document.querySelector('#input');
const searchBtn = document.querySelector('#button');
const gallery = document.querySelector('#gallery');
const alphabetUl = document.querySelector('#alphabet');
const templateWithoutResultText = document.querySelector('.gallery__sory');
templateWithoutResultText.remove();
templateWithoutResultText.classList.remove('is-hidden');
const favoriteCocktails = document.querySelector('[data-cocktails]');
const favoriteIngredients = document.querySelector('[data-ingredients]');
const divPagination = document.querySelector(".pagination-markup");


favoriteCocktails.addEventListener('click', showFavoritesCocktails);
favoriteIngredients.addEventListener('click', showFavoritesIngredients);

getAlphabetMarkup(alphabetUl);

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const cocktailName = searchField.value.trim();
  if (cocktailName === '') {
    Notify.info('Please enter the name of your cocktail');
    return;
  }

  paginateCocktails(searchCocktails, cocktailName);
  console.log("top")

});

alphabetUl.addEventListener('click', async event => {
  if (event.target.classList.contains('letterInLi')) {
    const resultLetter = event.target.textContent;
    const drinks = await searchByFirstLetter(resultLetter);

    if (!drinks.length) {
      gallery.innerHTML = '';
      gallery.append(templateWithoutResultText);
    } else {
      const template = getDrinksMarkup(drinks);
      gallery.innerHTML = /*html*/`
        <h2>Searching results</h2>
        <ul class="gallery__list list">
          ${template.join('')}
        </ul>`;
    }
  }
});

gallery.addEventListener('click', async event => {
  const addBtn = event.target.closest('[data-add-favorite]');
  if (addBtn) {
    addCocktailToFavorites(addBtn.id);
    addBtn.classList.add('is-hidden');
    addBtn.parentNode
      .querySelector('[data-remove-favorite]')
      .classList.remove('is-hidden');
  }
  const removeBtn = event.target.closest('[data-remove-favorite]');
  if (removeBtn) {
    removeCocktailFromFavorites(removeBtn.id);
    removeBtn.classList.add('is-hidden');
    removeBtn.parentNode
      .querySelector('[data-add-favorite]')
      .classList.remove('is-hidden');
  }
  const detailsBtn = event.target.closest('[data-details]');
  if (detailsBtn) {
    await renderCocktailCard(detailsBtn.id);
  }
  const detailsIngredientBtn = event.target.closest('[data-ingredient-details]');
  if (detailsIngredientBtn) {
    await renderIngredientCard(detailsIngredientBtn.id);
  }
});

const getRandomCoctails = async () => {
  const randomCocktails = await searchRandom();
  const template = getDrinksMarkup(randomCocktails);
  gallery.innerHTML = /*html*/`
    <h2>Cocktails</h2>
    <ul class="gallery__list list">
      ${template.join('')}
    </ul>`;
};

getRandomCoctails();

async function paginateCocktails (getData, params) {
    const resultData = await getData(params);
    let currentPage = 1;
    let cocktails = 3;
    console.log("paginate");
    if (window.innerWidth > 767 && window.innerWidth < 1280) {
        cocktails = 6;
      } else if (window.innerWidth > 1279) {
        cocktails = 9;
      }

      const drawCocktails = (dataWithAllCocktails, cocktailsPerPage, page) => {
        if (!dataWithAllCocktails.length) {
            gallery.innerHTML = '';
            gallery.append(templateWithoutResultText);
          } else {
            console.log("draw");

        page -= 1; 

        const start = cocktailsPerPage * page;
        const end = start + cocktailsPerPage;
        const paginatedCocktails = dataWithAllCocktails.slice(start, end);
        gallery.innerHTML = /*html*/`
      <h2>Searching results</h2>
      <ul class="gallery__list list">
        ${getDrinksMarkup(paginatedCocktails).join("")}
      </ul>`;
      }
    }

      const displayPaginationBtn = (page) => {
      const paginationItem = document.createElement('li');
      paginationItem.classList.add("pagination-item");
      paginationItem.innerText = page;

      if(currentPage === page) {
        paginationItem.classList.add("pagination-item-active");
        
      }

      paginationItem.addEventListener("click", () => {
        currentPage = page;
        drawCocktails(resultData, cocktails, currentPage);

        let currentItemLi = document.querySelector(".pagination-item-active");
        currentItemLi.classList.remove("pagination-item-active");

        paginationItem.classList.add("pagination-item-active");

      })
      return paginationItem;
   
      }

      const displayPagination = (dataWithAllCocktails, cocktailsPerPage) => {
        

        const numberOfPages = Math.ceil(dataWithAllCocktails.length / cocktailsPerPage);
        console.log(numberOfPages);
        const ulPaginationBtns = document.createElement("ul");
        ulPaginationBtns.classList.add("pagination-list");

        for(let i = 1; i <= numberOfPages; i += 1) {
            const oneBtn = displayPaginationBtn(i); 
            ulPaginationBtns.appendChild(oneBtn);

        }
        divPagination.innerHTML = "";
        divPagination.appendChild(ulPaginationBtns);


      }
      drawCocktails(resultData, cocktails, currentPage)
      displayPagination(resultData, cocktails);
      

    }

