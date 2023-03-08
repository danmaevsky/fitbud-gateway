// Imports
import AuthenticateToken from "../util";

require("dotenv").config();
const express = require("express");
const FITNESS_PORT = process.env.FITNESS_PORT;
const ACCOUNT_PORT = process.env.ACCOUNT_PORT;

const router = express.Router();
const recipesURL = `http://localhost:${FITNESS_PORT}/recipes`;
const authURL = `http://localhost:${ACCOUNT_PORT}/auth`;
let foodRequest;
let foodResponse;

/* Get Recipe by ID */
router.get("/:recipeId", async (request, response) => {
    if (request.params.foodId) {
        recipesRequest = `${recipesURL}/${request.params.foodId}`;
        recipesResponse = await fetch(recipesRequest, {
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
        /*
		let tokenIsAuthenticated = await AuthenticateToken(request, authURL);
		if (!tokenIsAuthenticated){
			response.status(403).json({ message: "Failed Authentication: Access is Forbidden."})
		}
		*/
        foodRequest = `${foodURL}/?barcode=${request.query.barcode}`;
        foodResponse = await fetch(foodRequest, {
            method: "GET",
        }).then((response) => response.json());
    } else if (request.query.userId) {
        // We will do user authentication to prevent client from making this request unless it is their own account
        /*
		let tokenIsAuthenticated = await AuthenticateToken(request, authURL);
		if (!tokenIsAuthenticated){
			response.status(403).json({ message: "Failed Authentication: Access is Forbidden."})
		}
		*/
        foodRequest = `${foodURL}/?userId=${request.query.userId}`;
        foodResponse = await fetch(foodRequest, {
            method: "GET",
        }).then((response) => response.json());
    }

    response.send(foodResponse);
});

module.exports = router;
