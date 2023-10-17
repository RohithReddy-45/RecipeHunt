import loadSpinner from './loadSpinner.js';
import showRecipeIngredients from './showRecipeIngredients.js';

const searchBar = document.querySelector('.search-bar');
const searchBox = document.querySelector('.search-box');
export const heroSection = document.querySelector('.hero');
export const recipeContainer = document.querySelector('.recipe-container');
const searchFail = document.querySelector('.search-fail');

export const searchFailed = message => {
  searchFail.classList.remove('hidden');
  searchFail.textContent = message;
};

const fetchRecipes = async function (query) {
  try {
    loadSpinner(heroSection);
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}`
    );
    const data = await res.json();

    if (data.results === 0) {
      clearSections();
      searchFailed('No recipes found. Please try again!');
      return;
    }

    heroSection.innerHTML = '';

    data.data.recipes.forEach(recipe => {
      const html = `
        <div class="flex flex-row flex-wrap gap-12 items-center overflow-hidden justify-center w-80 p-6 lg:mt-6">
          <div class="recipe-items flex flex-col text-start gap-3 p-4 bg-white shadow-lg rounded overflow-hidden">
            <img class="w-80 h-56 rounded" src="${recipe.image_url}" />
            <p class="recipe-publisher font-medium text-lg text-orange-600">
              ${recipe.publisher}
            </p>
            <p class="recipe-title font-bold text-xl capitalize overflow-hidden truncate">
              ${recipe.title}...
            </p>
            <a href="/recipe/${recipe.id}" class="btn-seerecipe bg-orange-500 text-white text-center rounded-lg font-medium py-2 px-4 hover:bg-orange-400 duration-300 ">See recipe</a>
          </div>
        </div>
      `;
      recipeContainer.insertAdjacentHTML('afterbegin', html);
    });
  } catch {
    clearSections();
    searchFailed('Something went wrong. Please try again!');
  }
};

recipeContainer.addEventListener('click', function (event) {
  event.preventDefault();
  const btn = event.target.closest('.btn-seerecipe');
  const body = document.querySelector('body');
  if (!btn) return;
  const link = event.target.getAttribute('href');
  const recipeId = link.substring(link.lastIndexOf('/') + 1);
  showRecipeIngredients(recipeId);
  body.classList.add('overflow-y-hidden');
});

export function clearSections() {
  heroSection.innerHTML = '';
  recipeContainer.innerHTML = '';
}

searchBar.addEventListener('submit', e => {
  e.preventDefault();
  recipeContainer.innerHTML = '';
  searchFail.classList.add('hidden');

  const searchInput = searchBox.value.trim();
  fetchRecipes(searchInput);
  searchBox.value = '';
});
