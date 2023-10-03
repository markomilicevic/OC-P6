// Global config
const config = {
	// LocalStorage key containing Credentials
	// The versioning is a good practice because this data is stored at client-side
	CREDENTIALS_LOCAL_STORAGE_KEY: "credentials-v1",
	// API base URL (string: `protocol://domain:port`)
	API_BASE_URL: "http://localhost:5678",
	// Hard-coded default filtering Category's Id
	DEFAULT_ALL_CATEGORY_ID: -1,
};

// Global state
const state = {
	// Credentials of the logged user or null if the user is not logged
	credentials: null,
	// List of all available Works (Array<Work>)
	works: [],
	// List of all Categories from all available Works (Array<Category>)
	worksCategories: [],
	// Current category's Id to use for filtering (number or -1 for no filtering)
	filteringByCategoryId: config.DEFAULT_ALL_CATEGORY_ID,
};

/**
 * Show a page loader that is displayed over the entire page
 * This page loader is recommended to be used during an HTTP query
 */
function showPageLoader() {
	const bodyElement = document.querySelector("body");

	const pageLoaderElement = document.createElement("div");
	pageLoaderElement.className = "page-loader";
	pageLoaderElement.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i>`;

	bodyElement.appendChild(pageLoaderElement);
}

/**
 * Hide a page loader
 * This page loader is recommended to be used during an HTTP query
 */
function hidePageLoader() {
	const pageLoaderElement = document.querySelector(".page-loader");
	if (pageLoaderElement !== null) {
		pageLoaderElement.remove();
	}
}

/**
 * Show a success Growl during few seconds
 *
 * @param {string} message Message to show
 */
function showSuccessGrowl(message) {
	const bodyElement = document.querySelector("body");

	const growlElement = document.createElement("div");
	growlElement.className = "growl growl-success";
	growlElement.innerText = message;
	bodyElement.appendChild(growlElement);

	window.setTimeout(() => growlElement.remove(), 10000);
}

/**
 * Show an error Growl during few seconds
 *
 * @param {string} message Message to show
 */
function showErrorGrowl(message) {
	const bodyElement = document.querySelector("body");

	const growlElement = document.createElement("div");
	growlElement.className = "growl growl-error";
	growlElement.innerText = message;
	bodyElement.appendChild(growlElement);

	window.setTimeout(() => growlElement.remove(), 10000);
}
