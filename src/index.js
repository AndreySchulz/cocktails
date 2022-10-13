import { elements as el } from './js/elements';
import { setTheme } from './js/theme';
import { throttle } from './js/throttle';
import { clickGallery } from './js/gallery';
import { Notify } from 'notiflix';
import {
  searchCocktails,
  searchByFirstLetter,
  searchRandom,
} from './js/helpers/api';
import { getAlphabetMarkup, getDrinksMarkup } from './js/helpers/helpers';
import { getFavoriteTheme } from './js/favorites';
import {
  showFavoritesCocktails,
  showFavoritesIngredients,
} from './js/favorites-cards';
import { onAuthClickCreate } from './js/firebase';
import { openMobileMenu, closeMobileMenu } from './js/mobile-nav';

setTheme(getFavoriteTheme());
getAlphabetMarkup([el.alphabetUl, el.mobileSelectEl]);

getRandomCoctails();

el.favoriteCocktails.addEventListener('click', event => {
  clearLetters();
  hiddenHeroContainer();
  closeMobileMenu();
  showFavoritesCocktails(event);
});
el.favoriteIngredients.addEventListener('click', event => {
  clearLetters();
  hiddenHeroContainer();
  closeMobileMenu();
  showFavoritesIngredients(event);
});

let paginator;

el.searchMobileForm.addEventListener('submit', async event => {
  event.preventDefault();

  const cocktailName = el.searchMobileField.value.trim();
  if (cocktailName === '') {
    Notify.info('Please enter the name of your cocktail');
    return;
  }
  closeMobileMenu();
  showHeroContainer();
  clearLetters();
  paginator = await paginateCocktails(searchCocktails, cocktailName);
  paginator.next();
  event.target.elements[`mobile-input`].value = '';
});

el.searchForm.addEventListener('submit', async event => {
  event.preventDefault();

  const cocktailName = el.searchField.value.trim();
  if (cocktailName === '') {
    Notify.info('Please enter the name of your cocktail');
    return;
  }

  showHeroContainer();
  clearLetters();
  paginator = await paginateCocktails(searchCocktails, cocktailName);
  paginator.next();
  event.target.elements[`input`].value = '';
});

el.mobileSelectEl.addEventListener('change', async ({ target }) => {
  paginator = await paginateCocktails(searchByFirstLetter, target.value);
  paginator.next();
});

el.alphabetUl.addEventListener('click', async ({ target }) => {
  if (target.classList.contains('letterInLi')) {
    clearLetters();
    target.classList.add('letterInLi--active');
    paginator = await paginateCocktails(
      searchByFirstLetter,
      target.textContent
    );
    paginator.next();
  }
});

function clearLetters() {
  [...el.alphabetUl.querySelectorAll('.letterInLi--active')].forEach(item =>
    item.classList.remove('letterInLi--active')
  );
}

el.gallery.addEventListener('click', clickGallery);

async function getRandomCoctails() {
  const randomCocktails = await searchRandom();
  const template = getDrinksMarkup(randomCocktails);
  el.gallery.innerHTML = /*html*/ `
    <h2 class="gallery__title">Cocktails</h2>
    <ul class="gallery__list list">
      ${template.join('')}
    </ul>`;
}

async function paginateCocktails(getData, params) {
  const resultData = await getData(params);
  let cocktailsPerPage = 3;

  if (window.innerWidth > 767 && window.innerWidth < 1280) {
    cocktailsPerPage = 6;
  } else if (window.innerWidth > 1279) {
    cocktailsPerPage = 9;
  }
  let lastRender = 0;
  let listItems;
  const drawCocktails = () => {
    if (!resultData.length) {
      el.gallery.innerHTML = '';
      el.gallery.append(el.templateWithoutResultText);
    } else {
      if (lastRender >= resultData.length) return;
      const end = lastRender + cocktailsPerPage;
      if (!listItems) {
        el.gallery.innerHTML = /*html*/ `
        <h2 class="gallery__title">Searching results</h2>
        <ul class="gallery__list list">
          ${getDrinksMarkup(resultData.slice(0, end)).join('')}
        </ul>`;
        listItems = el.gallery.querySelector('.gallery__list');
      } else {
        listItems.insertAdjacentHTML(
          'beforeend',
          getDrinksMarkup(resultData.slice(lastRender, end)).join('')
        );
      }
      lastRender = end;
    }
  };
  return {
    next: drawCocktails,
  };
}
window.addEventListener('scroll', onScroll);
function onScroll() {
  throttle(handleScroll, 500);
}

const handleScroll = async () => {
  const { height: cardHeight = 0 } = el.gallery
    .querySelector('.gallery__item')
    ?.getBoundingClientRect();
  const endOfPage =
    window.innerHeight + window.pageYOffset + cardHeight >=
    document.body.offsetHeight;

  if (endOfPage && paginator) {
    paginator.next();
  }
};

el.boxAuthBtn.addEventListener('click', onAuthClickCreate(el.boxAuthBtn));

el.burgerBtn.addEventListener('click', () =>
  el.nav.classList.contains('is-open') ? closeMobileMenu() : openMobileMenu()
);

el.toggleSwitch.addEventListener('change', ({ target }) =>
  setTheme(target.checked ? 'Dark' : 'Light')
);

el.selectBtn.addEventListener('click', () => {
  el.mobileSelectEl.classList.remove('is-hidden');
  el.mobileSelectEl.focus();
});

el.mobileSelectEl.addEventListener('click', selectEvent);

function selectEvent(event) {
  event.currentTarget.classList.add('is-hidden');
  el.selectBtn.classList.add('is-active');
  el.selectBtn.firstElementChild.textContent = event.target.value;
}

el.mobileSelectEl.addEventListener('blur', event =>
  event.currentTarget.classList.add('is-hidden')
);

function showHeroContainer() {
  el.heroContainer.classList.remove('is-hidden');
}
function hiddenHeroContainer() {
  el.heroContainer.classList.add('is-hidden');
}
