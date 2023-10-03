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
 * Delete previous and create all new Works into the DOM
 *
 * @param {Array<Work>} works New list of Works
 */
function replaceWorks(works, filteringByCategoryId) {
	const galleryElement = document.querySelector(".gallery");

	// Remove all Works from the DOM
	galleryElement.innerHTML = "";

	// Add all Works into the DOM
	for (let index = 0; index < state.works.length; index++) {
		const work = state.works[index];

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

		// Show all works
		replaceWorks(state.works, state.filteringByCategoryId);
	} catch (err) {
		console.log(`An error occurred in home: ${err.message}`);
	}
})();
