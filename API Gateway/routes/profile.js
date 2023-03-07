require("dotenv").config();
const express = require("express");
const FITNESS_PORT = process.env.FITNESS_PORT;
const ACCOUNT_PORT = process.env.ACCOUNT_PORT;

const router = express.Router();
const foodURL = `http://localhost:${FITNESS_PORT}/food`;
const authURL = `http://localhost:${ACCOUNT_PORT}/auth`;
let foodRequest;
let foodResponse;

/* Get Food by ID */
router.get("/:foodId", async (request, response) => {
    if (request.params.foodId) {
        foodRequest = `${foodURL}/${request.params.foodId}`;
        foodResponse = await fetch(foodRequest, {
            method: "GET",
        }).then((response) => response.json());
    }
    response.send(foodResponse);
});

/* Get Food by Search, Barcode, or User ID */
router.get("/", async (request, response) => {
    if (request.query.search) {
        foodRequest = `${foodURL}/?search=${request.query.search}`;
        foodResponse = await fetch(foodRequest, {
            method: "GET",
        }).then((response) => response.json());
    } else if (request.query.barcode) {
        // We could authenticate?
        foodRequest = `${foodURL}/?barcode=${request.query.barcode}`;
        foodResponse = await fetch(foodRequest, {
            method: "GET",
        }).then((response) => response.json());
    } else if (request.query.userId) {
        // We will do user authentication to prevent client from making this request unless it is their own account

        foodRequest = `${foodURL}/?userId=${request.query.userId}`;
        foodResponse = await fetch(foodRequest, {
            method: "GET",
        }).then((response) => response.json());
    }

    response.send(foodResponse);
});

module.exports = router;
