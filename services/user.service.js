const userRepository = require("../repositories/user.repository");
const { NotFoundError, ConflictError } = require("../utils/errors");

class UserService {
	createUser(userData) {
		const { username, name, email, role } = userData;

		// Check if username exists
		if (userRepository.existsByUsername(username)) {
			throw new ConflictError("Username already exists.");
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
			throw new NotFoundError("User not found.");
		}
		return user;
	}

	updateUser(username, updateData) {
		const { name, email, role, newUsername } = updateData;

		// Find existing user
		const user = userRepository.findByUsername(username);
		if (!user) {
			throw new NotFoundError("User not found.");
		}

		// Check if new username already exists
		if (newUsername && newUsername !== username) {
			if (userRepository.existsByUsername(newUsername)) {
				throw new ConflictError("New username already exists.");
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
