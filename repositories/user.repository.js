const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class UserRepository {
	async findAll() {
		return await prisma.user.findMany();
	}

	async findByUsername(username) {
		return await prisma.user.findUnique({
			where: { username },
		});
	}

	async existsByUsername(username) {
		const user = await prisma.user.findUnique({
			where: { username },
		});
		return user !== null;
	}

	async create(user) {
		return await prisma.user.create({
			data: user,
		});
	}

	async update(username, updatedUser) {
		return await prisma.user.update({
			where: { username },
			data: updatedUser,
		});
	}
}

module.exports = new UserRepository();
