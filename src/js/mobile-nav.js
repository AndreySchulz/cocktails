const nav = document.querySelector('.header__navigation');
const burgerBtn = document.querySelector('.header__burger');

export function openMobileMenu() {
  disableScroll();
  nav.classList.add('is-open');
  burgerBtn.firstElementChild.style.display = 'none';
  burgerBtn.lastElementChild.style.display = '';
}

export function closeMobileMenu() {
  enableScroll();
  nav.classList.remove('is-open');
  burgerBtn.firstElementChild.style.display = '';
  burgerBtn.lastElementChild.style.display = 'none';
}

export function disableScroll() {
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
}
export function enableScroll() {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}
