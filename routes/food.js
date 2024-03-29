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
		try {
			foodResponse = await fetch(foodRequest, {
				method: "GET",
			}).then((res) => {
				console.log("Food Response Status:", res.status);
				response.status(res.status);
				return res.json();
			});
		} catch (err) {
			console.log("Caught Error in Gateway:", err.message);
			return response.status(500).send({ message: err.message });
		}
	} else {
		return response.status(400).send({ message: "Bad Request" });
	}
	response.setHeader("Cache-Control", "max-age=86400");
	response.send(foodResponse);
});

/* Get Food by Search, Barcode, or User ID */
router.get("/", async (request, response) => {
	if (request.query.search) {
		foodRequest = `${foodURL}/?search=${encodeURIComponent(request.query.search)}`;
	} else if (request.query.barcode) {
		// We could authenticate?
		/*
		let tokenIsAuthenticated = await AuthenticateToken(request, authURL);
		if (!tokenIsAuthenticated){
			response.status(403).json({ message: "Failed Authentication: Access is Forbidden."})
		}
		*/
		foodRequest = `${foodURL}/?barcode=${request.query.barcode}`;
	} else if (request.query.userId) {
		// We will do user authentication to prevent client from making this request unless it is their own account
		if ((await util.AuthenticateToken(request, response)) !== 200) {
			return;
		}

		let token = request.get("Authorization").split(" ")[1];
		let userId = jwt.decode(token).userId;
		if (!userId || userId !== request.query.userId) {
			console.log(`userId in accessToken (${userId}) does not match userId in query parameters (${request.query.userId})`);
			return response.status(401).send({
				message: "Authentication failed. Credentials do not match query parameter 'userId'. Identity theft is pretty bad you know...",
			});
		}

		foodRequest = `${foodURL}/?userId=${request.query.userId}`;
	} else {
		console.log("Bad Request");
		return response.status(400).send({ message: "Bad Request" });
	}

	try {
		foodResponse = await fetch(foodRequest, {
			method: "GET",
		}).then((res) => {
			console.log("Food Response Status:", res.status);
			response.status(res.status);
			return res.json();
		});
	} catch (err) {
		console.log("Caught Error in Gateway:", err.message);
		return response.status(500).send({ message: err.message });
	}

	response.send(foodResponse);
});

/* POST a new food to the database */
router.post("/", util.AuthTokenMiddleware, async (request, response) => {
	// Authentication must happen!!
	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;
	console.log("userId:", userId);
	foodRequest = foodURL;
	let foodRequestBody = {
		userId: userId,
		...request.body,
	};
	try {
		foodResponse = await fetch(foodRequest, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(foodRequestBody),
		}).then((res) => {
			console.log("Food Response Status:", res.status);
			response.status(res.status);
			return res.json();
		});
	} catch (err) {
		console.log("Caught Error in Gateway:", err.message);
		return response.status(500).send({ message: err.message });
	}
	response.send(foodResponse);
});

module.exports = router;
