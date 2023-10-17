import { clearSections, searchFailed, recipeContainer } from './index.js';

const showRecipeIngredients = async function (recipesid) {
  try {
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${recipesid}`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    let { recipe } = data.data;
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    const markup = `
      <div
      id="myModal"
      class="modal-pop-up fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden backdrop-blur-lg bg-black/30"
    >
      <div class="relative p-6 max-h-screen w-[37rem]">
        <div class="ingredient-details rounded-lg bg-white p-6 shadow-lg ">
          <div class="pop-up-recipe flex flex-col gap-2">
            <h2 class="mr-9 text-xl font-bold text-orange-500 md:text-2xl">
              ${recipe.title}
            </h2>
            <div class="btn-close-popup">
              <button
                id="closeModal"
                class="absolute right-10 top-10 text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div class="time flex items-center gap-2">
              <svg
                class="h-5 w-5 text-gray-800 dark:text-gray-700"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6v4l3.276 3.276M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <p>${recipe.cookingTime} minutes</p>
            </div>

            <div class="servings relative flex items-center gap-2">
              <svg
                class="h-5 w-5 text-gray-800 dark:text-gray-700"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path
                  d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"
                />
                </svg>

              <p>${recipe.servings} Servings</p>
            
          </div>

            <div class="ingredients">
              <h1 class="mb-2 mt-4 text-center text-lg font-bold uppercase">
                Recipe Ingredients
              </h1>
              <ul class="ingredient-list r flex flex-col gap-2 p-4">
              ${recipe.ingredients
                .map(ing => {
                  return `
                <li class="rec-ingredient flex items-baseline gap-2 leading-7">
                  <svg
                    class="h-3 w-3 text-gray-800 dark:text-gray-700"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 8 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"
                    />
                  </svg>
                  <div class="quantity">${
                    ing.quantity ? ing.quantity.toString() : ''
                  }</div>
                  <div class="rec-description">
                    <span class="recipe-unit">${ing.unit}</span>
                    ${ing.description}
                  </div>
                </li>
                `;
                })
                .join('')}
               </ul>

                <div
                  class="mt-9 flex flex-col items-center justify-center gap-2 bg-gray-100 p-3"
                >
                  <h1 class="text-lg font-bold">How to cook it</h1>
                  <p class="text-center">
                    This recipe was designed and tested by <span class="font-semibold">${
                      recipe.publisher
                    }</span>
                    .Check out the directions at their website.
                  </p>
                  <a class="btn-directions rounded-lg bg-orange-500 px-4 py-2 font-medium text-white duration-300 hover:bg-orange-400" href="${
                    recipe.sourceUrl
                  }">Directions</a>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      `;

    recipeContainer.insertAdjacentHTML('afterbegin', markup);

    const btnClose = document.querySelector('.btn-close-popup');
    const modalWindow = document.querySelector('.modal-pop-up');

    btnClose.addEventListener('click', e => {
      const body = document.querySelector('body');
      e.preventDefault();
      modalWindow.classList.add('hidden');
      modalWindow.classList.remove('flex');
      body.classList.remove('overflow-y-hidden');
    });

    const directionsButton = document.querySelector('.btn-directions');
    directionsButton.addEventListener('click', function (event) {
      event.preventDefault();
      window.open(recipe.sourceUrl, '_blank');
    });
  } catch {
    clearSections();
    searchFailed('Something went wrong, please try again!');
  }
};

export default showRecipeIngredients;
