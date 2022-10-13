const templateWithoutResultText = document.querySelector('.gallery__sorry');
templateWithoutResultText.remove();
templateWithoutResultText.style.display = '';

export const elements = {
  gallery: document.querySelector('#gallery'),
  mobileSelectEl: document.querySelector('.hero__select'),
  selectBtn: document.querySelector('.select__header'),
  toggleSwitch: document.querySelector('#switch'),
  burgerBtn: document.querySelector('.header__burger'),
  nav: document.querySelector('.header__navigation'),
  boxAuthBtn: document.querySelector('#authBtnLog'),
  heroContainer: document.querySelector('.hero'),
  searchMobileForm: document.querySelector('#mobile-form'),
  searchForm: document.querySelector('#form'),
  searchMobileField: document.querySelector('#mobile-input'),
  searchField: document.querySelector('#input'),
  alphabetUl: document.querySelector('#alphabet'),
  favoriteCocktails: document.querySelector('[data-cocktails]'),
  favoriteIngredients: document.querySelector('[data-ingredients]'),
  backDropModalIngredients: document.querySelector('#modal-ingredient'),
  modalCocktailBackDrop: document.querySelector('#modal-cocktail'),
  templateWithoutResultText,
};
