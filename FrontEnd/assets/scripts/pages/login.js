// Custom Errors for the login result
class WrongCredentialsError extends Error {}
class InternalServerError extends Error {}

/**
 * Call the API to get Credentials using email and password
 *
 * @returns {Promise<Credentials>} Successfully signed data
 * @throws {WrongCredentialsError | InternalServerError | Error} Wrong crendentials | Internal error | Network error
 */
async function getCredentialsFromAPI(email, password) {
	if (!email || !password) {
		throw new Error("Invalid arguments");
	}

	return await fetch(`${config.API_BASE_URL}/api/users/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	}).then((response) => {
		switch (response.status) {
			case 404:
				throw new WrongCredentialsError();
			case 200:
				return response.json();
			default:
				throw new InternalServerError(`${response.status}`);
		}
	});
}

/**
 * Remove the previous (if present) signin error message
 */
function removePreviousLoginErrorMessage() {
	const errorMessageElement = document.querySelector("#login form .error-message");
	if (errorMessageElement === null) {
		return; // No previous error message
	}
	errorMessageElement.remove();
}

/**
 * Show the signin error message
 *
 * @argument {String} errorMessage Error message to show
 */
function showLoginErrorMessage(errorMessage) {
	const formElement = document.querySelector("#login form");

	const errorMessageElement = document.createElement("p");
	errorMessageElement.classList.add("error-message");
	errorMessageElement.innerText = errorMessage;

	formElement.prepend(errorMessageElement);
}

/**
 * Store the crendentials inside the LocalStorage

 * @param {Credentials} credentials Signed user's Credentials
 */
function setCredentialsIntoLocalStorage(credentials) {
	window.localStorage.setItem(config.CREDENTIALS_LOCAL_STORAGE_KEY, JSON.stringify(credentials));
}

/**
 * Bind the login form
 */
function bindLoginForm() {
	const formElement = document.querySelector("#login form");

	formElement.addEventListener("submit", async (event) => {
		event.preventDefault(); // Prevent the default <form> submition behaviour

		try {
			removePreviousLoginErrorMessage();

			const emailElement = formElement.querySelector('[name="email"]');
			const passwordElement = formElement.querySelector('[name="password"]');

			const credentials = await getCredentialsFromAPI(emailElement.value, passwordElement.value);

			setCredentialsIntoLocalStorage(credentials);

			redirectToHome();
		} catch (err) {
			if (err instanceof WrongCredentialsError) {
				showLoginErrorMessage("Erreur dans l’identifiant ou le mot de passe");
			} else if (err instanceof InternalServerError) {
				showLoginErrorMessage("Une erreur est survenue, merci de réessayer dans un instant");
			} else {
				showLoginErrorMessage("Une erreur est survenue, merci de vérifier votre connectivité puis de réessayer");
			}
		}
	});
}

/**
 * Redirect the current user to the Home
 */
function redirectToHome() {
	window.location.href = "../";
}

try {
	if (window.localStorage.getItem(config.CREDENTIALS_LOCAL_STORAGE_KEY) !== null) {
		// The user is already logged
		redirectToHome();
	} else {
		// The user is not yet logged
		bindLoginForm();
	}
} catch (err) {
	showErrorGrowl("Navré, une erreur est survenue, merci de recharger la page dans quelques instants"); // TODO: Use i18n here
	console.log(`An error occurred in login: ${err.message}`);
}
