const fs = require("fs");
const path = require("path");
const userFilePath = path.join(__dirname, "../data/user.json");

class UserRepository {
	readUsers() {
		return JSON.parse(fs.readFileSync(userFilePath, "utf8"));
	}

	writeUsers(users) {
		fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2), "utf8");
	}

	findAll() {
		return this.readUsers();
	}

	findByUsername(username) {
		const users = this.readUsers();
		return users.find((u) => u.username === username);
	}

	existsByUsername(username) {
		const users = this.readUsers();
		return users.some((u) => u.username === username);
	}

	create(user) {
		const users = this.readUsers();
		users.push(user);
		this.writeUsers(users);
		return user;
	}

	update(username, updatedUser) {
		const users = this.readUsers();
		const index = users.findIndex((u) => u.username === username);
		if (index !== -1) {
			users[index] = updatedUser;
			this.writeUsers(users);
			return updatedUser;
		}
		return null;
	}
}

module.exports = new UserRepository();
