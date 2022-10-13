const nav = document.querySelector('.header__navigation');
const burgerBtn = document.querySelector('.header__burger');

export function openMobileMenu() {
  document.body.style.overflow = 'hidden';
  nav.classList.add('is-open');
  burgerBtn.firstElementChild.style.display = 'none';
  burgerBtn.lastElementChild.style.display = '';
}

export function closeMobileMenu() {
  document.body.style.overflow = '';
  nav.classList.remove('is-open');
  burgerBtn.firstElementChild.style.display = '';
  burgerBtn.lastElementChild.style.display = 'none';
}
