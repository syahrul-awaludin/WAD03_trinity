require("dotenv").config();
const express = require("express");

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

console.log('Starting WAD03_trinity server...');

// Use routes from routes/index.js
const routes = require("./routes");
app.use("/", routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

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