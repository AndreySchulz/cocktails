const burgerBtn = document.querySelector('.header__burger');
const burgerNavBtn = document.querySelector('#icon-menu');
const closeNavBtn = document.querySelector('#icon-Vector');
const nav = document.querySelector('.header__navigation');

burgerBtn.addEventListener('click', () => {
    nav.classList.add('is-open');
})