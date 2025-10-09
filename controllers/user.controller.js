const userService = require("../services/user.service");

// POST /users ================================================
exports.createUser = (req, res) => {
	if (!req.body) {
		return res
			.status(400)
			.json({ success: false, message: "Request body is missing." });
	}

	try {
		const user = userService.createUser(req.body);
		res.status(201).json({ success: true, user });
	} catch (error) {
		const status = error.status || 500;
		const message = error.message || "Internal server error.";
		res.status(status).json({ success: false, message });
	}
};

// GET /users =======================================
exports.getUsers = (req, res) => {
	try {
		const users = userService.getAllUsers();
		res.json({ success: true, users });
	} catch (error) {
		const status = error.status || 500;
		const message = error.message || "Internal server error.";
		res.status(status).json({ success: false, message });
	}
};

// GET /users/:username ===============================================
exports.getUserByUsername = (req, res) => {
	const { username } = req.params;

	try {
		const user = userService.getUserByUsername(username);
		res.json({ success: true, user });
	} catch (error) {
		const status = error.status || 500;
		const message = error.message || "Internal server error.";
		res.status(status).json({ success: false, message });
	}
};

// PATCH /users/:username ===================================================
exports.updateUser = (req, res) => {
	if (!req.body) {
		return res
			.status(400)
			.json({ success: false, message: "Request body is missing." });
	}

	const { username } = req.params;

	try {
		const user = userService.updateUser(username, req.body);
		res.json({ success: true, user });
	} catch (error) {
		const status = error.status || 500;
		const message = error.message || "Internal server error.";
		res.status(status).json({ success: false, message });
	}
};
