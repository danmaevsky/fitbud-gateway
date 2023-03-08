// Imports
require("../util");

require("dotenv").config();
const express = require("express");
const FITNESS_URL = process.env.FITNESS_URL;
const ACCOUNT_PORT = process.env.ACCOUNT_PORT;

const router = express.Router();
const fitnessURL = `${FITNESS_URL}/food`;
// const authURL = `http://localhost:${ACCOUNT_PORT}/auth`;
let foodRequest;
let foodResponse;

/* Get Food by ID */
router.get("/:foodId", async (request, response) => {
  if (request.params.foodId) {
    foodRequest = `${fitnessURL}/${request.params.foodId}`;
    foodResponse = await fetch(foodRequest, {
      method: "GET",
    }).then((response) => response.json());
  }
  response.send(foodResponse);
});

/* Get Food by Search, Barcode, or User ID */
router.get("/", async (request, response) => {
  if (request.query.search) {
    foodRequest = `${fitnessURL}/?search=${request.query.search}`;
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
    foodRequest = `${fitnessURL}/?barcode=${request.query.barcode}`;
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
    foodRequest = `${fitnessURL}/?userId=${request.query.userId}`;
    foodResponse = await fetch(foodRequest, {
      method: "GET",
    }).then((response) => response.json());
  }

  response.send(foodResponse);
});

router.post("/", async (request, response) => {
  // FILLER
});

function ValidateFoodSubmission(response) {
  const requiredTopLevelProps = [
    "userId",
    "foodName",
    "brandName",
    "barcode",
    "servingName",
    "servingQuantity",
    "servingQuantityUnit",
    "nutritionalContent",
  ];
  const requiredNutrientsProps = [
    "kcal",
    "totalFat",
    "saturatedFat",
    "transFat",
    "polyunsaturatedFat",
    "monounsaturatedFat",
    "cholesterol",
    "sodium",
    "totalCarb",
    "dietaryFiber",
    "totalSugar",
    "addedSugar",
    "sugarAlcohols",
    "protein",
    "vitaminD",
    "calcium",
    "iron",
    "potassium",
    "vitaminA",
    "vitaminC",
    "vitaminE",
    "thiamin",
    "riboflavin",
    "niacin",
    "vitaminB6",
    "folate",
    "vitaminB12",
    "biotin",
    "pantothenicAcid",
    "phosphorus",
    "iodine",
    "magnesium",
    "selenium",
  ];
  return (
    Boolean(response.body) &&
    requiredTopLevelProps.reduce((accumulator, current) => accumulator && Object.hasOwn(response.body, current), true) &&
    requiredNutrientsProps.reduce((accumulator, current) => accumulator && Object.hasOwn(response.body.nutritionalContent, current), true)
  );
}

module.exports = router;
