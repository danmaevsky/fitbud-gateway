require("dotenv").config();
const express = require("express");
const FITNESS_URL = process.env.FITNESS_URL;
const PROFILE_URL = process.env.PROFILE_URL;

const router = express.Router();
const foodURL = `${FITNESS_URL}/food`;
let fitnessRequest;
let fitnessResponse;

/* Get Food by ID */
router.get("/:foodId", async (request, response) => {
	if (request.params.foodId) {
		fitnessRequest = `${foodURL}/${request.params.foodId}`;
		fitnessResponse = await fetch(fitnessRequest, {
			method: "GET",
		}).then((res) => {
			response.status(res.status);
			return res.json();
		});
	}
	// console.log(fitnessResponse);
	response.send(fitnessResponse);
});

/* Get Food by Search, Barcode, or User ID */
router.get("/", async (request, response) => {
	if (request.query.search) {
		fitnessRequest = `${foodURL}/?search=${request.query.search}`;
		fitnessResponse = await fetch(fitnessRequest, {
			method: "GET",
		}).then((res) => {
			response.status(res.status);
			return res.json();
		});
	} else if (request.query.barcode) {
		// We could authenticate?
		fitnessRequest = `${foodURL}/?barcode=${request.query.barcode}`;
		fitnessResponse = await fetch(fitnessRequest, {
			method: "GET",
		}).then((res) => {
			response.status(res.status);
			return res.json();
		});
	} else if (request.query.userId) {
		// We will do user authentication to prevent client from making this request unless it is their own account
		fitnessRequest = `${foodURL}/?userId=${request.query.userId}`;
		fitnessResponse = await fetch(fitnessRequest, {
			method: "GET",
		}).then((res) => {
			response.status(res.status);
			return res.json();
		});
	}

	response.send(fitnessResponse);
});

module.exports = router;
