// Global config
const config = {
	// API base URL (string: `protocol://domain:port`)
	API_BASE_URL: "http://localhost:5678",
	// Hard-coded default filtering Category's Id
	DEFAULT_ALL_CATEGORY_ID: -1,
};

// Global state
const state = {
	// List of all available Works (Array<Work>)
	works: [],
	// List of all Categories from all available Works (Array<Category>)
	worksCategories: [],
	// Current category's Id to use for filtering (number or -1 for no filtering)
	filteringByCategoryId: config.DEFAULT_ALL_CATEGORY_ID,
};
