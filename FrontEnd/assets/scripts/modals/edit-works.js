/**
 * Call the API to delete an Work
 *
 * @param {number} workId Work's id to delete
 * @returns {Promise<void>}
 */
async function deleteWorkUsingAPI(workId) {
	if (!workId) {
		throw new Error("Invalid arguments");
	}

	return await fetch(`${config.API_BASE_URL}/api/works/${parseInt(workId, 10)}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${state.credentials.token}`,
		},
	}).then((res) => {
		if (!res.ok) {
			// Not a 2xx response
			throw new Error(res.statusText);
		}
		return res;
	});
}

/**
 * Show the Edit Works modal
 */
function showEditWorksModal() {
	showModal({
		modalTitle: "Galerie photo", // TODO: Use i18n here
		onModalShowed: (modalMainElement) => {
			const scrollableElement = document.createElement("div");
			scrollableElement.className = "scrollable";

			const worksElement = document.createElement("div");
			worksElement.className = "works";

			for (let index = 0; index < state.works.length; index++) {
				const work = state.works[index];

				const figureElement = document.createElement("figure");
				figureElement.className = "work";
				figureElement.dataset.workId = work.id;

				const imgElement = document.createElement("img");
				imgElement.alt = work.title;
				imgElement.src = work.imageUrl;
				figureElement.appendChild(imgElement);

				const deleteElement = document.createElement("a");
				deleteElement.href = "#";
				deleteElement.className = "delete-icon";
				deleteElement.title = "Supprimer"; // TODO: Use i18n here
				deleteElement.innerHTML = '<i class="fa-solid fa-trash-can fa-sm"></i>';
				deleteElement.addEventListener("click", async (event) => {
					event.preventDefault(); // Prevent default `<a href="#">` behaviour

					try {
						showPageLoader();

						const workIdToDelete = parseInt(event.target.closest(".work").dataset.workId, 10);

						// Delete Work using API
						await deleteWorkUsingAPI(workIdToDelete);

						// Remove this Work from the current list
						figureElement.remove();

						// Remove this Work from the state
						state.works = state.works.filter((work) => work.id !== workIdToDelete);

						if (!state.works.length) {
							// Nothing to show
							worksElement.classList.add("no-project");
							worksElement.innerHTML = "Aucun projet"; // TODO: Use i18n here
						}

						// Refresh all Works in DOM
						replaceWorks(state.works, state.filteringByCategoryId);

						showSuccessGrowl("Projet supprimé!"); // TODO: Use i18n here
					} catch (err) {
						showErrorGrowl("Une erreur est survenue lors de la suppression du projet, veuillez réessayer"); // TODO: Use i18n here
						console.error(`An error occurred while deleting an Work: ${err.message}`);
					} finally {
						hidePageLoader();
					}
				});
				figureElement.appendChild(deleteElement);

				worksElement.appendChild(figureElement);
			}

			if (!state.works.length) {
				// Nothing to show
				worksElement.classList.add("no-project");
				worksElement.innerHTML = "Aucun projet"; // TODO: Use i18n here
			}

			scrollableElement.appendChild(worksElement);

			modalMainElement.appendChild(scrollableElement);
		},
		modalFooterButtonEnabled: true,
		modalFooterButtonLabel: "Ajouter une photo", // TODO: Use i18n here
		onModalFooterButtonClicked: () => {
			// Switch to Add Work modal
			showAddWorkModal();
		},
	});
}
