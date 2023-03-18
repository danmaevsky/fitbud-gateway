// Imports
const util = require("../util");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const express = require("express");
const FITNESS_URL = process.env.FITNESS_URL;

const router = express.Router();
const recipesURL = `${FITNESS_URL}/recipes`;
let recipesRequest;
let recipesResponse;

/* Get Recipe by ID */
router.get("/:recipeId", util.AuthTokenMiddleware, async (request, response) => {
	if (request.params.recipeId) {
		recipesRequest = `${recipesURL}/${request.params.recipeId}`;
		recipesResponse = await fetch(recipesRequest, {
			method: "GET",
		})
			.then((res) => {
				response.status(res.status);
				return res.json();
			})
			.catch((err) => {
				response.status(500).send({ message: err.message });
			});
	} else {
		return response.status(400).send({ message: "Bad Request" });
	}

	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;
	if (userId !== recipesResponse.userId) {
		console.log(`userId in accessToken (${userId}) does not match userId in query parameters (${request.query.userId})`);
		response.status(401).send({ message: "Not permitted to view recipes that do not belong to you!" });
	}
	console.log("Response from Fitness API:", recipesResponse);
	console.log("Message from Fitness:", recipesResponse ? recipesResponse.message : recipesResponse);
	response.send(recipesResponse);
});

/* Get Recipe by User ID */
router.get("/", util.AuthTokenMiddleware, async (request, response) => {
	if (request.query.userId) {
		let token = request.get("Authorization").split(" ")[1];
		let userId = jwt.decode(token).userId;
		if (userId !== request.query.userId) {
			console.log(`userId in accessToken (${userId}) does not match userId in query parameters (${request.query.userId})`);
			return response.status(401).send({ message: "Not permitted to view recipes that do not belong to you!" });
		}
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
		})
			.then((res) => {
				response.status(res.status);
				return res.json();
			})
			.catch((err) => {
				response.status(500).send({ message: err.message });
			});
	} else {
		return response.status(400).send({ message: "Bad Request" });
	}
	console.log("Response from Fitness API:", recipesResponse);
	console.log("Message from Fitness:", recipesResponse ? recipesResponse.message : recipesResponse);
	response.send(recipesResponse);
});

/* POST a new recipe */
router.post("/", util.AuthTokenMiddleware, async (request, response) => {
	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;
	recipesRequest = recipesURL;
	let recipesRequestBody = {
		userId: userId,
		...request.body,
	};
	recipesResponse = await fetch(recipesRequest, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(recipesRequestBody),
	})
		.then((res) => {
			response.status(res.status);
			return res.json();
		})
		.catch((err) => {
			response.status(500).send({ message: err.message });
		});
	console.log("Response from Fitness API:", recipesResponse);
	console.log("Message from Fitness:", recipesResponse ? recipesResponse.message : recipesResponse);
	response.send(recipesResponse);
});

/* PATCH a recipe by ID */
router.patch("/:recipeId", util.AuthTokenMiddleware, async (request, response) => {
	if (request.params.recipeId) {
		let token = request.get("Authorization").split(" ")[1];
		let userId = jwt.decode(token).userId;
		recipesRequest = `${recipesURL}/${request.params.recipeId}`;
		let recipesRequestBody = {
			userId: userId,
			...request.body,
		};
		recipesResponse = await fetch(recipesRequest, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(recipesRequestBody),
		})
			.then((res) => {
				response.status(res.status);
				return res.json();
			})
			.catch((err) => {
				response.status(500).send({ message: err.message });
			});
	} else {
		return response.status(400).send({ message: "Bad Request" });
	}
	console.log("Response from Fitness API:", recipesResponse);
	console.log("Message from Fitness:", recipesResponse ? recipesResponse.message : recipesResponse);
	response.send(recipesResponse);
});

/* DELETE a recipe by ID */
router.delete("/:recipeId", util.AuthTokenMiddleware, async (request, response) => {
	if (request.params.recipeId) {
		let token = request.get("Authorization").split(" ")[1];
		let userId = jwt.decode(token).userId;
		recipesRequest = `${recipesURL}/${request.params.recipeId}`;
		recipesResponse = await fetch(recipesRequest, {
			method: "DELETE",
			body: JSON.stringify({ userId: userId }),
		})
			.then((res) => {
				response.status(res.status);
				return res.json();
			})
			.catch((err) => {
				response.status(500).send({ message: err.message });
			});
	} else {
		return response.status(400).send({ message: "Bad Request" });
	}
	console.log("Response from Fitness API:", recipesResponse);
	console.log("Message from Fitness:", recipesResponse ? recipesResponse.message : recipesResponse);
	response.send(recipesResponse);
});

module.exports = router;
