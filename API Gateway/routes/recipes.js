// Imports
require("../util");

require("dotenv").config();
const express = require("express");
const FITNESS_URL = process.env.FITNESS_URL;
const ACCOUNT_URL = process.env.ACCOUNT_URL;

const router = express.Router();
const recipesURL = `${FITNESS_URL}/recipes`;
const authURL = `${ACCOUNT_URL}/auth`;
let recipesRequest;
let recipesResponse;

/* Get Recipe by ID */
router.get("/:recipeId", async (request, response) => {
	if (request.params.recipeId) {
		recipesRequest = `${recipesURL}/${request.params.recipeId}`;
		recipesResponse = await fetch(recipesRequest, {
			method: "GET",
		})
			.then((response) => response.json())
			.catch((err) => {
				response.status(500).json({ message: err.message });
			});
	} else {
		recipesRequest = recipesURL;
		recipesResponse = await fetch(recipesRequest, {
			method: "GET",
		})
			.then((response) => response.json())
			.catch((err) => {
				response.status(500).json({ message: err.message });
			});
	}

	response.send(recipesResponse);
});

/* Get Recipe by User ID */
router.get("/", async (request, response) => {
	if (request.query.userId) {
		// We will do user authentication to prevent client from making this request unless it is their own account
		/*
		let tokenIsAuthenticated = await AuthenticateToken(request, authURL);
		if (!tokenIsAuthenticated){
			response.status(403).json({ message: "Failed Authentication: Access is Forbidden."})
		}
		*/
		recipesRequest = `${recipesURL}/?userId=${request.query.userId}`;
		recipesResponse = await fetch(recipesRequest, {
			method: "GET",
		}).then((response) => response.json());
	}

	response.send(recipesResponse);
});

/* POST a new recipe */
router.post("/", async (request, response) => {
	// Authentication must happen!!
	recipesRequest = recipesURL;
	recipesResponse = await fetch(recipesRequest, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(request.body),
	}).then((response) => response.json());

	response.send(recipesResponse);
});

/* PATCH a recipe by ID */
router.patch("/:recipeId", async (request, response) => {
	// Authentication must happen!!
	recipesRequest = recipesURL;
	recipesResponse = await fetch(recipesRequest, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(request.body),
	}).then((response) => response.json());

	response.send(recipesResponse);
});

/* DELETE a recipe by ID */
router.delete("/:recipeId", async (request, response) => {
	if (request.params.recipeId) {
		recipesRequest = `${recipesURL}/${request.params.recipeId}`;
		recipesResponse = await fetch(recipesRequest, {
			method: "DELETE",
		}).then((response) => response.json());
	}
	response.send(recipesResponse);
});

module.exports = router;
