const users = [];

// Helper function for email validation
function isValidEmail(email) {
	// Simple regex for demonstration (not exhaustive)
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /users ================================================
exports.createUser = (req, res) => {
	if (!req.body) {
		return res
			.status(400)
			.json({ success: false, message: "Request body is missing." });
	}
	const { username, name, email, role } = req.body;

	// Manual validation
	if (!username || typeof username !== "string" || username.trim() === "") {
		return res
			.status(400)
			.json({ success: false, message: "Username is required." });
	}
	if (!name || typeof name !== "string" || name.trim() === "") {
		return res
			.status(400)
			.json({ success: false, message: "Name is required." });
	}
	if (!email || typeof email !== "string" || email.trim() === "") {
		return res
			.status(400)
			.json({ success: false, message: "Email is required." });
	}
	if (!isValidEmail(email)) {
		return res
			.status(400)
			.json({ success: false, message: "Invalid email format." });
	}
	if (!role || (role !== "buyer" && role !== "seller")) {
		return res
			.status(400)
			.json({ success: false, message: "Role must be 'buyer' or 'seller'." });
	}

	/**Username and form vaidation */
	if (users.find((u) => u.username === username)) {
		return res
			.status(409)
			.json({ success: false, message: "Username already exists." });
	}

	// Use plain JS object
	const user = { username, name, email, role };
	users.push(user);
	res.status(201).json({ success: true, user });
};

// GET /users =======================================
exports.getUsers = (req, res) => {
	res.json({ success: true, users });
};

// GET /users/:username ===============================================
exports.getUserByUsername = (req, res) => {
	const { username } = req.params;
	const user = users.find((u) => u.username === username);
	if (!user) {
		return res.status(404).json({ success: false, message: "User not found." });
	}
	res.json({ success: true, user });
};

// PATCH /users/:username ===================================================
exports.updateUser = (req, res) => {
	if (!req.body) {
		return res
			.status(400)
			.json({ success: false, message: "Request body is missing." });
	}
	const { username } = req.params;
	const user = users.find((u) => u.username === username);
	if (!user) {
		return res.status(404).json({ success: false, message: "User not found." });
	}
	const { name, email, role, newUsername } = req.body;

	// Manual validation for PATCH
	if (
		newUsername &&
		(typeof newUsername !== "string" || newUsername.trim() === "")
	) {
		return res
			.status(400)
			.json({ success: false, message: "New username is invalid." });
	}
	if (email && !isValidEmail(email)) {
		return res
			.status(400)
			.json({ success: false, message: "Invalid email format." });
	}
	if (role && role !== "buyer" && role !== "seller") {
		return res
			.status(400)
			.json({ success: false, message: "Role must be 'buyer' or 'seller'." });
	}

	// Username update logic
	if (newUsername && newUsername !== username) {
		if (users.find((u) => u.username === newUsername)) {
			return res
				.status(409)
				.json({ success: false, message: "New username already exists." });
		}
		user.username = newUsername;
	}

	if (name) user.name = name;
	if (email) user.email = email;
	if (role) user.role = role;
	res.json({ success: true, user });
};
