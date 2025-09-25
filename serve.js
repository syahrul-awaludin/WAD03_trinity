require("dotenv").config();
const express = require("express");
const aboutUsRoutes = require("./routes/aboutUsRoutes");
const userRoutes = require("./routes/users"); // import user routes
const productRoutes = require("./routes/products"); // import product routes
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.use("/", aboutUsRoutes);
app.use("/", userRoutes);
app.use("/", productRoutes);

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
});
