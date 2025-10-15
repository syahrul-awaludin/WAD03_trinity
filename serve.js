require("dotenv").config();
const express = require("express");
const aboutUsRoutes = require("./routes/aboutUsRoutes");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const errorHandler = require("./utils/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", aboutUsRoutes);
app.use("/", userRoutes);
app.use("/", productRoutes);
app.use("/", cartRoutes);

app.use(errorHandler);

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
