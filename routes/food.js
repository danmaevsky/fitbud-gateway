// Imports
require("dotenv").config();
const jwt = require("jsonwebtoken");
const util = require("../util");
const express = require("express");

const FITNESS_URL = process.env.FITNESS_URL;

const router = express.Router();
const foodURL = `${FITNESS_URL}/food`;
// const authURL = `http://localhost:${ACCOUNT_PORT}/auth`;
let foodRequest;
let foodResponse;

/* Get Food by ID */
router.get("/:foodId", async (request, response) => {
	if (request.params.foodId) {
		foodRequest = `${foodURL}/${request.params.foodId}`;
		foodResponse = await fetch(foodRequest, {
			method: "GET",
		})
			.then((res) => {
				response.status(res.status);
				return res.json();
			})
			.catch((err) => {
				response.status(500).json({ message: err.message });
			});
	}
	response.send(foodResponse);
});

/* Get Food by Search, Barcode, or User ID */
router.get("/", async (request, response) => {
	if (request.query.search) {
		foodRequest = `${foodURL}/?search=${request.query.search}`;
		foodResponse = await fetch(foodRequest, {
			method: "GET",
		}).then((res) => {
			response.status(res.status);
			return res.json();
		});
	} else if (request.query.barcode) {
		// We could authenticate?
		/*
		let tokenIsAuthenticated = await AuthenticateToken(request, authURL);
		if (!tokenIsAuthenticated){
			response.status(403).json({ message: "Failed Authentication: Access is Forbidden."})
		}
		*/
		foodRequest = `${foodURL}/?barcode=${request.query.barcode}`;
		foodResponse = await fetch(foodRequest, {
			method: "GET",
		}).then((res) => {
			response.status(res.status);
			return res.json();
		});
	} else if (request.query.userId) {
		// We will do user authentication to prevent client from making this request unless it is their own account
		if ((await util.AuthenticateToken(request, response)) !== 200) {
			return;
		}

		let token = request.get("Authorization").split(" ")[1];
		let userId = jwt.decode(token).userId;
		if (!userId || userId !== request.query.userId) {
			response.status(401).send({
				message: "Authentication failed. Credentials do not match query parameter 'userId'. Identity theft is pretty bad you know...",
			});
			return;
		}
		foodRequest = `${foodURL}/?userId=${request.query.userId}`;
		foodResponse = await fetch(foodRequest, {
			method: "GET",
		}).then((res) => {
			response.status(res.status);
			return res.json();
		});
	}

	response.send(foodResponse);
});

/* POST a new food to the database */
router.post("/", util.AuthTokenMiddleware, async (request, response) => {
	// Authentication must happen!!
	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;
	foodRequest = foodURL;
	let foodRequestBody = {
		userId: userId,
		...request.body,
	};
	foodResponse = await fetch(foodRequest, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(foodRequestBody),
	}).then((res) => {
		response.status(res.status);
		return res.json();
	});

	response.send(foodResponse);
});

module.exports = router;
