/**
 * Show or update the modal
 *
 * @param {object} config The modal configuration
 * @param {string} config.modalTitle The modal title (text only)
 * @param {function(HTMLElement)} config.onModalShowed When the modal is showed
 * @param {function} config.onModalBackClick The modal back link is clicked
 * @param {boolean} config.modalFooterButtonEnabled Did the footer button is enabled?
 * @param {string} config.modalFooterButtonLabel The modal footer button label (text only)
 * @param {function} config.onModalFooterButtonClicked When the modal button is clicked
 */
function showModal({ modalTitle, onModalShowed, onModalBackClick, modalFooterButtonEnabled, modalFooterButtonLabel, onModalFooterButtonClicked }) {
	let currentModalRootElement = document.querySelector(".modal-root");
	if (currentModalRootElement !== null) {
		// A modal is currently visible: Destroy-it
		currentModalRootElement.remove();
	}

	// Show the modal

	const bodyElement = document.querySelector("body");

	const modalRootElement = document.createElement("div");
	modalRootElement.className = "modal-root";

	const modalBackgroundElement = document.createElement("div");
	modalBackgroundElement.className = "modal-background";
	modalBackgroundElement.addEventListener("click", () => {
		modalRootElement.remove();
	});
	modalRootElement.appendChild(modalBackgroundElement);

	const modalContentElement = document.createElement("div");
	modalContentElement.className = "modal-content";

	const modalHeaderElement = document.createElement("div");
	modalHeaderElement.className = "modal-header";

	const modalBackElement = document.createElement("a");
	modalBackElement.className = "modal-back";
	if (onModalBackClick) {
		modalBackElement.href = "#";
		modalBackElement.title = "Revenir en arrière"; // TODO: Use i18n here
		modalBackElement.innerHTML = `<i class="fa-solid fa-arrow-left fa-lg"></i>`;
		modalBackElement.addEventListener("click", (event) => {
			event.preventDefault(); // Prevent default `<a href="#">` behaviour
			onModalBackClick();
		});
	}
	modalHeaderElement.appendChild(modalBackElement);

	const modalCloseElement = document.createElement("a");
	modalCloseElement.href = "#";
	modalCloseElement.className = "modal-close";
	modalCloseElement.title = "Fermer"; // TODO: Use i18n here
	modalCloseElement.innerHTML = '<i class="fa-solid fa-xmark fa-lg"></i>';
	modalCloseElement.addEventListener("click", (event) => {
		event.preventDefault(); // Prevent default `<a href="#">` behaviour
		modalRootElement.remove();
	});
	modalHeaderElement.appendChild(modalCloseElement);

	modalContentElement.appendChild(modalHeaderElement);

	const modalTitleElement = document.createElement("strong");
	modalTitleElement.className = "modal-title";
	modalTitleElement.innerText = modalTitle;
	modalContentElement.appendChild(modalTitleElement);

	const modalMainElement = document.createElement("div");
	modalMainElement.className = "modal-main";
	modalContentElement.appendChild(modalMainElement);

	const modalFooterElement = document.createElement("div");
	modalFooterElement.className = "modal-footer";

	const addWorkButton = document.createElement("a");
	addWorkButton.href = "#";
	addWorkButton.className = "submit-button";
	if (!modalFooterButtonEnabled) {
		addWorkButton.classList.add("disabled-button");
	}
	addWorkButton.innerText = modalFooterButtonLabel;
	addWorkButton.addEventListener("click", (event) => {
		event.preventDefault(); // Prevent default `<a href="#">` behaviour
		onModalFooterButtonClicked();
	});

	modalFooterElement.appendChild(addWorkButton);

	modalContentElement.appendChild(modalFooterElement);

	modalRootElement.appendChild(modalContentElement);

	bodyElement.appendChild(modalRootElement);

	onModalShowed(modalMainElement);
}

