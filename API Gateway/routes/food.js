require("dotenv").config();
const express = require("express");
const FITNESS_PORT = process.env.FITNESS_PORT;

const router = express.Router();
const fitnessURL = `http://localhost:${FITNESS_PORT}/food`;
let fitnessRequest;
let fitnessResponse;

/* Get Food by ID */
router.get("/:foodId", async (request, response) => {
    if (request.params.foodId) {
        fitnessRequest = `${fitnessURL}/${request.params.foodId}`;
        fitnessResponse = await fetch(fitnessRequest, {
            method: "GET",
        }).then((response) => response.json());
    }
    // console.log(fitnessResponse);
    response.send(fitnessResponse);
});

/* Get Food by Search, Barcode, or User ID */
router.get("/", async (request, response) => {
    if (request.query.search) {
        fitnessRequest = `${fitnessURL}/?search=${request.query.search}`;
        fitnessResponse = await fetch(fitnessRequest, {
            method: "GET",
        }).then((response) => response.json());
    } else if (request.query.barcode) {
        // We could authenticate?
        fitnessRequest = `${fitnessURL}/?barcode=${request.query.barcode}`;
        fitnessResponse = await fetch(fitnessRequest, {
            method: "GET",
        }).then((response) => response.json());
    } else if (request.query.userId) {
        // We will do user authentication to prevent client from making this request unless it is their own account
        fitnessRequest = `${fitnessURL}/?userId=${request.query.userId}`;
        fitnessResponse = await fetch(fitnessRequest, {
            method: "GET",
        }).then((response) => response.json());
    }

    response.send(fitnessResponse);
});

module.exports = router;
