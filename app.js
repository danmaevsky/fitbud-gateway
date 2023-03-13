require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
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
