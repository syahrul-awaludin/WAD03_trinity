require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const aboutUsRoutes = require("./routes/aboutUsRoutes");
const userRoutes = require("./routes/users");
const cartRoutes = require("./routes/cart");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;


app.use("/", aboutUsRoutes);
app.use("/", userRoutes);
app.use("/", cartRoutes);


app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		success: false,
		message: "Something went wrong!",
	});
});

console.log("Starting WAD03_trinity server...");
app.listen(PORT, () => {
	console.log(`✅ WAD03_trinity Server running on port ${PORT}`);
	console.log(`🌐 Open: http://localhost:${PORT}`);
	console.log(`Available endpoints:`);
	console.log(`- GET /`);
	console.log(`- GET /api/greeting`);
	console.log(`- GET /api/greeting?name=YourName`);
	console.log(`- GET /api/greeting/:name`);
	console.log(`- POST /api/greeting`);
	console.log(`- POST /users`);
	console.log(`- GET /users`);
	console.log(`- GET /users/:username`);
	console.log(`- PATCH /users/:username`);
	console.log(`- POST /carts/:username/add`);
	console.log(`- POST /carts/:username/remove`);
	console.log(`- GET /carts/:username`);
});
