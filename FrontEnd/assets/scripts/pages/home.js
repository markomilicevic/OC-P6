/**
 * Call the API to fetch all Works
 *
 * @returns {Promise<Array<Work>} List of all Works
 */
async function getWorksFromAPI() {
	return await fetch(`${config.API_BASE_URL}/api/works`)
		.then((res) => {
			if (!res.ok) {
				// Not a 2xx response
				throw new Error(res.statusText);
			}
			return res;
		})
		.then((data) => data.json());
}

/**
 * Get all uniq Categories from the passed Works
 *
 * @param {Array<Work>} works List of Works
 * @returns {Array<Category>} List of Categories
 */
function getCategoriesFromWorks(works) {
	const uniqIds = new Set();
	const categories = [];

	works.forEach((work) => {
		if (!uniqIds.has(work.categoryId)) {
			uniqIds.add(work.categoryId);
			categories.push(work.category);
		}
	});

	return categories;
}

/**
 * Delete previous and create all new Categories filters into the DOM
 *
 * @param {Array<Category>} categories New list of Categories
 */
function replaceCategoriesFilters(categories) {
	const filtersElement = document.querySelector(".filters");

	// Remove all Categories filter from the DOM
	filtersElement.innerHTML = "";

	// Prepend the default filtering option
	const categoriesWithDefault = [
		{
			id: config.DEFAULT_ALL_CATEGORY_ID,
			name: "Tous", // TODO: Use i18n here
		},
		...categories,
	];

	for (let index = 0; index < categoriesWithDefault.length; index++) {
		const category = categoriesWithDefault[index];

		const liElement = document.createElement("li");

		const aElement = document.createElement("a");
		aElement.dataset.categoryId = category.id;
		aElement.innerText = category.name;
		liElement.appendChild(aElement);

		filtersElement.appendChild(liElement);
	}
}

/**
 * Bind the Categories filters for new selections
 *
 * @param {Function} onCategorySelected Callback when category selected (the new category's ID is passed in parameter)
 */
function bindCategoriesFilters(onCategorySelected) {
	const categoryElements = document.querySelectorAll(".filters a");

	for (let index = 0; index < categoryElements.length; index++) {
		const categoryElement = categoryElements[index];

		categoryElement.addEventListener("click", (event) => {
			event.preventDefault(); // Prevent the link's href following location

			onCategorySelected(parseInt(event.target.dataset.categoryId, 10));
		});
	}
}

/**
 * Change all Categories Filters to reflect the selected one and all other unselected into the DOM
 *
 * @param {number} filteringByCategoryId Current category's ID
 */
function selectCurrentCategoriesFilter(filteringByCategoryId) {
	const categoryElements = document.querySelectorAll(".filters a");

	for (let index = 0; index < categoryElements.length; index++) {
		const categoryElement = categoryElements[index];
		const categoryId = parseInt(categoryElement.dataset.categoryId, 10);

		if (categoryId === filteringByCategoryId) {
			// Currently in use
			categoryElement.classList.remove("inactive");
			categoryElement.classList.add("active");
			categoryElement.removeAttribute("href"); // Not clickable
		} else {
			// Not in use
			categoryElement.classList.remove("active");
			categoryElement.classList.add("inactive");
			categoryElement.href = "#";
		}
	}
}

/**
 * Delete previous and create all new Works into the DOM
 *
 * @param {Array<Work>} works New list of Works
 */
function replaceWorks(works, filteringByCategoryId) {
	const galleryElement = document.querySelector(".gallery");

	// Filter by category (client-side)
	let filteredWorks = [...works];
	if (filteringByCategoryId !== config.DEFAULT_ALL_CATEGORY_ID) {
		filteredWorks = filteredWorks.filter((work) => work.categoryId === filteringByCategoryId);
	}

	// Remove all Works from the DOM
	galleryElement.innerHTML = "";

	// Add all Works into the DOM
	for (let index = 0; index < filteredWorks.length; index++) {
		const work = filteredWorks[index];

		const figureElement = document.createElement("figure");

		const imgElement = document.createElement("img");
		imgElement.alt = work.title;
		imgElement.src = work.imageUrl;
		figureElement.appendChild(imgElement);

		const figcaptionElement = document.createElement("figcaption");
		figcaptionElement.innerText = work.title;
		figureElement.appendChild(figcaptionElement);

		galleryElement.appendChild(figureElement);
	}
}

// Top level async function created to catch: "Uncaught SyntaxError: await is only valid in async functions and the top level bodies of modules"
(async function () {
	try {
		// Fetch all works
		state.works = await getWorksFromAPI();

		// Extract all categories from all works
		// `GET /categories` is not used here because this endpoint return all available Categories including Categories without attached Works
		state.worksCategories = getCategoriesFromWorks(state.works);

		// Show all filters
		replaceCategoriesFilters(state.worksCategories);
		selectCurrentCategoriesFilter(state.filteringByCategoryId);
		bindCategoriesFilters((selectedCategoryID) => {
			// Category filtering changed
			state.filteringByCategoryId = selectedCategoryID;
			selectCurrentCategoriesFilter(state.filteringByCategoryId);
			// Update all works
			replaceWorks(state.works, state.filteringByCategoryId);
		});
		// Show all works
		replaceWorks(state.works, state.filteringByCategoryId);
	} catch (err) {
		console.log(`An error occurred in home: ${err.message}`);
	}
})();
