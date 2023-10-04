/**
 * Call the API to create an Work
 *
 * @param {File} image The image coming from `fileInput.files[0]`
 * @param {string} title The title
 * @param {number} category The Category's id
 * @returns {Promise<Work>} New created Work
 */
async function createWorkUsingAPI(image, title, category) {
	if (!image || !title || !category) {
		throw new Error("Invalid arguments");
	}

	// How I do the file upload: https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
	const formData = new FormData();
	formData.append("image", image);
	formData.append("title", title);
	formData.append("category", category);

	return await fetch(`${config.API_BASE_URL}/api/works`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${state.credentials.token}`,
		},
		body: formData,
	})
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
 * Call the API to fetch all Categories (including Categories without Works)
 *
 * @returns {Promise<Array<Category>} List of all Categories
 */
async function getCategoriesFromAPI() {
	return await fetch(`${config.API_BASE_URL}/api/categories`)
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
 * Load all Categories from the API to the LocalStorage
 * This list of Categories is including Categories without Works
 *
 * @returns Promise<Array<Category>> List of Categories
 */
async function loadCategories() {
	if (!state.categories.length) {
		// Fetch only once
		try {
			state.categories = await getCategoriesFromAPI();
		} catch (err) {
			showErrorGrowl("Une erreur est survenue lors de la récuparation des categories, veuillez réessayer"); // TODO: Use i18n here
			console.error(`An error occurred while fetch Categories: ${err.message}`);
		}
	}

	return state.categories;
}

/**
 * Show the Add Works modal
 */
function showAddWorkModal() {
	const checkFormFields = () => {
		const formElement = document.querySelector(".add-work");

		// Trigger HTML5 form validation
		const formValidity = formElement.checkValidity();

		// Change submit button status
		changeModalFooterButtonStatus(formValidity);

		return formValidity;
	};

	const submitForm = async () => {
		if (!checkFormFields()) {
			const formElement = document.querySelector(".add-work");
			// Show HTML5 form errors
			formElement.reportValidity();
			return;
		}

		try {
			const imageInput = document.querySelector("input#image");
			const titleInput = document.querySelector("input#title");
			const categorySelect = document.querySelector("select#category");

			const newWork = await createWorkUsingAPI(imageInput.files[0], titleInput.value, parseInt(categorySelect.value, 10));

			// Add the new Work to the state
			state.works.push(newWork);

			// Refresh all Works in DOM
			replaceWorks(state.works, state.filteringByCategoryId);

			// Back to the previous modal view
			showEditWorksModal();

			showSuccessGrowl("Projet ajouté!"); // TODO: Use i18n here
		} catch (err) {
			showErrorGrowl("Une erreur est survenue lors de la création du projet, veuillez réessayer"); // TODO: Use i18n here
			console.error(`An error occurred while creating the Work: ${err.message}`);
		}
	};

	loadCategories().then(() => {
		showModal({
			modalTitle: "Ajout photo", // TODO: Use i18n here
			onModalShowed: (modalMainElement) => {
				const formElement = document.createElement("form");
				formElement.className = "add-work basic-form";
				formElement.action = "#";
				formElement.method = "POST";

				const imageContainerElement = document.createElement("div");
				imageContainerElement.className = "image-container constraints-visible";

				const imageConstraintsElement = document.createElement("div");
				imageConstraintsElement.className = "image-constraints";

				const imageIconElement = document.createElement("div");
				imageIconElement.className = "image-icon";
				imageIconElement.innerHTML = `<i class="fa-regular fa-image"></i>`;
				imageConstraintsElement.appendChild(imageIconElement);

				const addButtonElement = document.createElement("div");
				addButtonElement.className = "image-button";
				addButtonElement.innerText = "+ Ajouter photo"; // TODO: Use i18n here
				imageConstraintsElement.appendChild(addButtonElement);

				const instructionsElement = document.createElement("div");
				instructionsElement.className = "image-type";
				instructionsElement.innerText = "jpg, png : 4mo max"; // TODO: Use i18n here
				imageConstraintsElement.appendChild(instructionsElement);

				imageContainerElement.appendChild(imageConstraintsElement);

				const imagePreviewElement = document.createElement("div");
				imagePreviewElement.className = "image-preview";
				imageContainerElement.appendChild(imagePreviewElement);

				const imageInput = document.createElement("input");
				imageInput.type = "file";
				imageInput.name = "image";
				imageInput.accept = config.UPLOAD_ACCEPTED_FILE_EXTENSIONS.join(",");
				imageInput.id = "image";
				imageInput.required = true;
				imageInput.addEventListener("input", () => {
					// Be sure to be in default mode
					imageContainerElement.classList.add("constraints-visible");
					imageContainerElement.classList.remove("preview-visible");

					const fileExtension = imageInput.files[0].name.split(".").pop().toLocaleLowerCase();
					if (!config.UPLOAD_ACCEPTED_FILE_EXTENSIONS.includes(`.${fileExtension}`)) {
						// Extension is not accepte
						showErrorGrowl(`Le fichier doit être une image avec une extension :  ${config.UPLOAD_ACCEPTED_FILE_EXTENSIONS.join(", ")}`);
						// Unselect that file
						imageInput.value = "";
						return;
					}

					const fileSize = imageInput.files[0].size;
					if (fileSize > config.UPLOAD_MAX_FILE_SIZE_IN_BYTES) {
						// File is too big
						showErrorGrowl(`L'image est trop lourde avec un maximum de : ${config.UPLOAD_MAX_FILE_SIZE_LABEL}`);
						// Unselect that file
						imageInput.value = "";
						return;
					}

					checkFormFields();

					// Remove previous preview
					imagePreviewElement.innerHTML = "";

					// Set preview from current file
					const imgElement = document.createElement("img");
					imgElement.alt = "Aperçu de l'image séléctionée"; // TODO: Use i18n here
					imgElement.src = URL.createObjectURL(imageInput.files[0]);
					imagePreviewElement.appendChild(imgElement);

					// Switch to preview mode
					imageContainerElement.classList.remove("constraints-visible");
					imageContainerElement.classList.add("preview-visible");
				});
				imageContainerElement.appendChild(imageInput);

				formElement.appendChild(imageContainerElement);

				const titleLabel = document.createElement("label");
				titleLabel.htmlFor = "title";
				titleLabel.innerText = "Titre"; // TODO: Use i18n here
				formElement.appendChild(titleLabel);

				const titleInput = document.createElement("input");
				titleInput.type = "text";
				titleInput.name = "title";
				titleInput.id = "title";
				titleInput.required = true;
				titleInput.addEventListener("input", () => checkFormFields());
				formElement.appendChild(titleInput);

				const categoryLabel = document.createElement("label");
				categoryLabel.htmlFor = "category";
				categoryLabel.innerText = "Catégorie"; // TODO: Use i18n here
				categoryLabel.required = true;
				formElement.appendChild(categoryLabel);

				const customSelectElement = document.createElement("div");
				customSelectElement.className = "custom-select";

				const selectArrowElement = document.createElement("div");
				selectArrowElement.className = "select-arrow";
				selectArrowElement.innerHTML = `<i class="fa-solid fa-chevron-down fa-sm"></i>`;
				customSelectElement.appendChild(selectArrowElement);

				const categorySelect = document.createElement("select");
				categorySelect.name = "category";
				categorySelect.id = "category";
				categorySelect.required = true;
				categorySelect.addEventListener("change", () => checkFormFields());

				const firstCategoryOption = document.createElement("option");
				categorySelect.appendChild(firstCategoryOption);

				for (let index = 0; index < state.categories.length; index++) {
					const category = state.categories[index];

					const categoryOption = document.createElement("option");
					categoryOption.value = category.id;
					categoryOption.innerText = category.name;
					categorySelect.appendChild(categoryOption);
				}

				customSelectElement.appendChild(categorySelect);

				formElement.appendChild(customSelectElement);

				formElement.addEventListener("submit", async (event) => {
					event.preventDefault(); // Prevent default `<form action="#">` behaviour

					submitForm();
				});

				modalMainElement.appendChild(formElement);
			},
			onModalBackClick: () => {
				showEditWorksModal();
			},
			modalFooterButtonEnabled: false,
			modalFooterButtonLabel: "Valider", // TODO: Use i18n here
			onModalFooterButtonClicked: () => {
				submitForm();
			},
		});
	});
}
