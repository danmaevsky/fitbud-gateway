require("dotenv").config();
const validator = require("express-validator");
const cors = require("cors");
const express = require("express");
const app = express();
app.use(express.json());
app.use(
	cors({
		origin: "*",
	})
);
app.use((req, res, next) => {
	console.log("~~~~~~~~~~~~~~~~~~~~");
	console.log("Got Request!");
	req.method ? console.log("Method:", req.method) : null;
	req.originalUrl ? console.log("Original URL:", req.originalUrl) : null;
	req.get("Authorization") ? console.log("Authorization:", req.get("Authorization")) : null;
	console.log("~~~~~~~~~~~~~~~~~~~~");
	next();
});
const GATEWAY_PORT = process.env.GATEWAY_PORT;

// Routes
const foodRoute = require("./routes/food");
const recipesRoute = require("./routes/recipes");
const cardioRoute = require("./routes/cardio");
const strengthRoute = require("./routes/strength");
const workoutsRoute = require("./routes/workouts");
const accountRoute = require("./routes/account");
const profileRoute = require("./routes/profile");
const diaryRoute = require("./routes/diary");

// Use Routes
app.use("/food", foodRoute);
app.use("/recipes", recipesRoute);
app.use("/exercise/cardio", cardioRoute);
app.use("/exercise/strength", strengthRoute);
app.use("/workouts", workoutsRoute);
app.use("/account", accountRoute);
app.use("/profile", profileRoute);
app.use("/diary", diaryRoute);

// Start Listening
app.listen(GATEWAY_PORT, () => console.log("Gateway Server Started...listening on Port", GATEWAY_PORT)); // http://localhost:8000
