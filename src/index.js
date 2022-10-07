import { Notify } from "notiflix";
import { searchCoctails } from "./helpers/api";

const searchForm = document.querySelector("#form");
const searchField = document.querySelector("#input");
const searchBtn = document.querySelector("#button");
const gallery = document.querySelector("#gallery");

// console.log(form);

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
