const userRepository = require("../repositories/user.repository");

class UserService {
	// Helper function for email validation
	isValidEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	validateUserData(data, isUpdate = false) {
		const { username, name, email, role, newUsername } = data;
		const errors = [];

		if (!isUpdate) {
			if (!username || typeof username !== "string" || username.trim() === "") {
				errors.push("Username is required.");
			}
			if (!name || typeof name !== "string" || name.trim() === "") {
				errors.push("Name is required.");
			}
			if (!email || typeof email !== "string" || email.trim() === "") {
				errors.push("Email is required.");
			}
			if (!role || (role !== "buyer" && role !== "seller")) {
				errors.push("Role must be 'buyer' or 'seller'.");
			}
		} else {
			if (
				newUsername &&
				(typeof newUsername !== "string" || newUsername.trim() === "")
			) {
				errors.push("New username is invalid.");
			}
			if (role && role !== "buyer" && role !== "seller") {
				errors.push("Role must be 'buyer' or 'seller'.");
			}
		}

		if (email && !this.isValidEmail(email)) {
			errors.push("Invalid email format.");
		}

		return errors;
	}

	createUser(userData) {
		const { username, name, email, role } = userData;

		// Validate data
		const errors = this.validateUserData(userData);
		if (errors.length > 0) {
			throw { status: 400, message: errors[0] };
		}

		// Check if username exists
		if (userRepository.existsByUsername(username)) {
			throw { status: 409, message: "Username already exists." };
		}

		// Create user
		const user = { username, name, email, role };
		return userRepository.create(user);
	}

	getAllUsers() {
		return userRepository.findAll();
	}

	getUserByUsername(username) {
		const user = userRepository.findByUsername(username);
		if (!user) {
			throw { status: 404, message: "User not found." };
		}
		return user;
	}

	updateUser(username, updateData) {
		const { name, email, role, newUsername } = updateData;

		// Validate update data
		const errors = this.validateUserData(updateData, true);
		if (errors.length > 0) {
			throw { status: 400, message: errors[0] };
		}

		// Find existing user
		const user = userRepository.findByUsername(username);
		if (!user) {
			throw { status: 404, message: "User not found." };
		}

		// Check if new username already exists
		if (newUsername && newUsername !== username) {
			if (userRepository.existsByUsername(newUsername)) {
				throw { status: 409, message: "New username already exists." };
			}
			user.username = newUsername;
		}

		// Update fields
		if (name) user.name = name;
		if (email) user.email = email;
		if (role) user.role = role;

		return userRepository.update(username, user);
	}
}

module.exports = new UserService();
