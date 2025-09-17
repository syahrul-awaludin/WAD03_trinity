require("dotenv").config();
const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

// Use routes from routes/index.js
const routes = require("./routes");
app.use("/", routes);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
