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
        foodRequest = `${foodURL}/${request.params.foodId}`;
        foodResponse = await fetch(foodRequest, {
            method: "GET",
        })
        .then((res) => {
			response.status(res.status);
			return res.json();
		})
		.catch((err) => {
			response.status(500).send({ message: err.message });
		});
    }
    else {
        return response.status(400).send({ message: "Bad Request"})
    }
    response.send(foodResponse);
});

/* Get Food by Search, Barcode, or User ID */
router.get("/", async (request, response) => {
    if (request.query.search) {
        foodRequest = `${foodURL}/?search=${request.query.search}`;
    } else if (request.query.barcode) {
        // We could authenticate?
        foodRequest = `${foodURL}/?barcode=${request.query.barcode}`;
    } else if (request.query.userId) {
        // We will do user authentication to prevent client from making this request unless it is their own account
        foodRequest = `${foodURL}/?userId=${request.query.userId}`;
    }
    else {
        return response.status(400).send({ message: "Bad Request"})
    }

    foodResponse = await fetch(foodRequest, {
        method: "GET",
    })
    .then((res) => {
        response.status(res.status);
        return res.json();
    })
    .catch((err) => {
        response.status(500).send({ message: err.message });
    });

    response.send(foodResponse);
});

module.exports = router;
