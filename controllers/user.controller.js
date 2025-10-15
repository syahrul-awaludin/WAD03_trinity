const userService = require("../services/user.service");

const { BadRequestError } = require("../utils/errors");
const { UnprocessableEntityError } = require("../utils/errors");

const UserValidator = {
	isValidEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	},

	validateCreateUser(data) {
		const { username, name, email, role } = data;
		const errors = [];

		if (!username || typeof username !== "string" || username.trim() === "") {
			errors.push("Username is required.");
		}
		if (!name || typeof name !== "string" || name.trim() === "") {
			errors.push("Name is required.");
		}
		if (!email || typeof email !== "string" || email.trim() === "") {
			errors.push("Email is required.");
		} else if (!this.isValidEmail(email)) {
			errors.push("Invalid email format.");
		}
		if (!role || (role !== "buyer" && role !== "seller")) {
			errors.push("Role must be 'buyer' or 'seller'.");
		}

		if (errors.length > 0) {
			throw new UnprocessableEntityError(errors);
		}
	},

	validateUpdateUser(data) {
		const { newUsername, email, role } = data;
		const errors = [];

		if (
			newUsername !== undefined &&
			(typeof newUsername !== "string" || newUsername.trim() === "")
		) {
			errors.push("New username is invalid.");
		}
		if (email !== undefined && !this.isValidEmail(email)) {
			errors.push("Invalid email format.");
		}
		if (role !== undefined && role !== "buyer" && role !== "seller") {
			errors.push("Role must be 'buyer' or 'seller'.");
		}

		if (errors.length > 0) {
			throw new UnprocessableEntityError(errors);
		}
	},
};

// POST /users ================================================
exports.createUser = (req, res, next) => {
	try {
		if (!req.body || Object.keys(req.body).length === 0) {
			throw new BadRequestError("Request body is missing.");
		}
		UserValidator.validateCreateUser(req.body);

		const user = userService.createUser(req.body);
		res.status(201).json({ success: true, user });
	} catch (error) {
		next(error);
	}
};

// GET /users =======================================
exports.getUsers = (req, res, next) => {
	try {
		const users = userService.getAllUsers();
		res.json({ success: true, users });
	} catch (error) {
		next(error);
	}
};

// GET /users/:username ===============================================
exports.getUserByUsername = (req, res, next) => {
	try {
		const { username } = req.params;
		if (!username || username.trim() === "") {
			throw new BadRequestError("Username parameter is required.");
		}

		const user = userService.getUserByUsername(username);
		res.json({ success: true, user });
	} catch (error) {
		next(error);
	}
};

// PATCH /users/:username ===================================================
exports.updateUser = (req, res, next) => {
	try {
		if (!req.body || Object.keys(req.body).length === 0) {
			throw new BadRequestError("Request body is missing.");
		}

		const { username } = req.params;

		if (!username || username.trim() === "") {
			throw new BadRequestError("Username parameter is required.");
		}

		// Validate input
		UserValidator.validateUpdateUser(req.body);

		const user = userService.updateUser(username, req.body);
		res.json({ success: true, user });
	} catch (error) {
		next(error);
	}
};
