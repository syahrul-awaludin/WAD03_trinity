const errorHandler = (err, req, res, next) => {
	const status = err.status || err.statusCode || 500;
	const message = err.message || "Internal server error.";

	console.error(`[Error ${status}]:`, message);

	const response = {
		success: false,
		message,
		...(err.errors && { errors: err.errors }),
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	};

	res.status(status).json(response);
};

module.exports = errorHandler;
