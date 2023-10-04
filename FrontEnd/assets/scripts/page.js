// Global config
const config = {
	// LocalStorage key containing Credentials
	// The versioning is a good practice because this data is stored at client-side
	CREDENTIALS_LOCAL_STORAGE_KEY: "credentials-v1",
	// API base URL (string: `protocol://domain:port`)
	API_BASE_URL: "http://localhost:5678",
	// Hard-coded default filtering Category's Id
	DEFAULT_ALL_CATEGORY_ID: -1,
	// The accepted image file extensions (Array<string>)
	UPLOAD_ACCEPTED_FILE_EXTENSIONS: [".png", ".jpg", ".jpeg"],
	// The max image file size (in bytes)
	UPLOAD_MAX_FILE_SIZE_IN_BYTES: 4 * 1024 * 1024,
	// The max image file size label (string)
	UPLOAD_MAX_FILE_SIZE_LABEL: "4mo",
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
	// List of all Categories including Categories without Works (Array<Category>)
	categories: [],
};

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
