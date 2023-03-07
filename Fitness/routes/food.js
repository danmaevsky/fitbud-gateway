const express = require("express");

const router = express.Router();
const Food = require("../models/foodModel");

// GET by food ID
router.get("/:foodID", async (request, response) => {
  try {
    if (request.params.foodID.length != 24) {
      response.status(400).json({ message: "Invalid ID" });
    } else {
      const food = await Food.findById(request.params.foodID);
      console.log(food);
      if (food === null) {
        response.status(404).json({ message: "Food Not Found" });
      } else {
        response.status(200);
        console.log("Found Food:", food);
        response.send(food);
      }
    }
  } catch (e) {
    response.status(500).json({ message: "Internal Error" });
    console.log(e);
  }
});

// Keyword Search or Get By Barcode
router.get("/", async (request, response) => {
  if (request.query.search) {
    response.send({ message: "Keyword Search Not Yet Implemented" });
  } else {
    if (request.query.barcode) {
      try {
        const food = await Food.find({ barcode: request.query.barcode });
        console.log(food);
        if (food === null || food.length === 0) {
          response.status(404).json({ message: "Food Not Found" });
        } else {
          response.status(200);
          response.send(food[0]);
        }
      } catch (e) {
        response.status(500).json({ message: "Internal Error" });
        console.log(e);
      }
    } else {
      response.status(404).json({ message: "Page Not Found" });
    }
  }
});

// POST create food
router.post("/", async (request, response) => {});

// POST create food by barcode
router.post("/barcode", async (request, response) => {});

module.exports = router;
