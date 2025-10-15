const userRepository = require("../repositories/user.repository");
const { NotFoundError, ConflictError } = require("../utils/errors");

class UserService {
	async createUser(userData) {
		const { username, name, email, role } = userData;

		// Check if username exists
		if (await userRepository.existsByUsername(username)) {
			throw new ConflictError("Username already exists.");
		}

		// Create user with uppercase role for Prisma enum
		const user = {
			username,
			name,
			email,
			role: role.toUpperCase(),
		};
		return await userRepository.create(user);
	}

	async getAllUsers() {
		return await userRepository.findAll();
	}

	async getUserByUsername(username) {
		const user = await userRepository.findByUsername(username);
		if (!user) {
			throw new NotFoundError("User not found.");
		}
		return user;
	}

	async updateUser(username, updateData) {
		const { name, email, role, newUsername } = updateData;

		// Find existing user
		const user = await userRepository.findByUsername(username);
		if (!user) {
			throw new NotFoundError("User not found.");
		}

		// Prepare update data
		const updatedFields = {};
		if (name) updatedFields.name = name;
		if (email) updatedFields.email = email;
		if (role) updatedFields.role = role.toUpperCase();
		if (newUsername && newUsername !== username) {
			if (await userRepository.existsByUsername(newUsername)) {
				throw new ConflictError("New username already exists.");
			}
			updatedFields.username = newUsername;
		}

		return await userRepository.update(username, updatedFields);
	}
}

module.exports = new UserService();
