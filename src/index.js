import { Notify } from "notiflix";
import { searchCoctails, searchByFirstLetter } from "./helpers/api";
import { getAlphabetMarkup } from "./helpers/helpers"

const searchForm = document.querySelector("#form");
const searchField = document.querySelector("#input");
const searchBtn = document.querySelector("#button");
const gallery = document.querySelector("#gallery");
const alphabetUl = document.querySelector("#alphabet");


// console.log(form);



getAlphabetMarkup(alphabetUl);

searchForm.addEventListener("submit", async event => {
    event.preventDefault();
    const coctailName = searchField.value.trim();
    if (coctailName === "") {
        Notify.info("Please enter the name of your coctail");
        return;
    }
    const drinks = await searchCoctails(coctailName);
       
    const template = drinks.map(({ idDrink, strDrink, strDrinkThumb }) => {
        return `<li><a><img src="${strDrinkThumb}" alt="${strDrink}"/><h3>${strDrink}</h3><button>Learn more</button><button id="${idDrink}">Add to</button></a></li>`
    })
   gallery.innerHTML = template.join("");
})


alphabetUl.addEventListener("click", async event => {
    if(event.target.classList.contains("letterInLi")) {
        const resultLetter = event.target.textContent;
        const drinks = await searchByFirstLetter(resultLetter);

        const template = drinks.map(({ idDrink, strDrink, strDrinkThumb }) => {
            return `<li><a><img src="${strDrinkThumb}" alt="${strDrink}"/><h3>${strDrink}</h3><button>Learn more</button><button id="${idDrink}">Add to</button></a></li>`
        })
       gallery.innerHTML = template.join("");

        
    }
})