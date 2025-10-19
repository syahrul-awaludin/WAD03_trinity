const UserService = require("./user.service");
const userRepository = require("../repositories/user.repository");
const { NotFoundError, ConflictError } = require("../utils/errors");

jest.mock("../repositories/user.repository");

describe("UserService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("createUser", () => {
		test("throws ConflictError if username exists", async () => {
			userRepository.existsByUsername.mockResolvedValue(true);
			await expect(
				UserService.createUser({
					username: "alice",
					name: "Alice",
					email: "alice@example.com",
					role: "user",
				}),
			).rejects.toThrow(ConflictError);
		});

		test("creates user with uppercase role", async () => {
			userRepository.existsByUsername.mockResolvedValue(false);
			userRepository.create.mockResolvedValue({
				username: "bob",
				name: "Bob",
				email: "bob@example.com",
				role: "ADMIN",
			});
			const userData = {
				username: "bob",
				name: "Bob",
				email: "bob@example.com",
				role: "admin",
			};
			const result = await UserService.createUser(userData);
			expect(userRepository.create).toHaveBeenCalledWith({
				username: "bob",
				name: "Bob",
				email: "bob@example.com",
				role: "ADMIN",
			});
			expect(result.role).toBe("ADMIN");
		});
	});

	describe("getAllUsers", () => {
		test("returns all users", async () => {
			const users = [{ username: "alice" }, { username: "bob" }];
			userRepository.findAll.mockResolvedValue(users);
			const result = await UserService.getAllUsers();
			expect(result).toEqual(users);
		});
	});

	describe("getUserByUsername", () => {
		test("returns user if found", async () => {
			const user = { username: "alice" };
			userRepository.findByUsername.mockResolvedValue(user);
			const result = await UserService.getUserByUsername("alice");
			expect(result).toBe(user);
		});

		test("throws NotFoundError if user not found", async () => {
			userRepository.findByUsername.mockResolvedValue(null);
			await expect(UserService.getUserByUsername("charlie")).rejects.toThrow(
				NotFoundError,
			);
		});
	});

	describe("updateUser", () => {
		test("throws NotFoundError if user not found", async () => {
			userRepository.findByUsername.mockResolvedValue(null);
			await expect(
				UserService.updateUser("alice", { name: "Alice Updated" }),
			).rejects.toThrow(NotFoundError);
		});

		test("throws ConflictError if newUsername already exists", async () => {
			userRepository.findByUsername.mockResolvedValue({ username: "alice" });
			userRepository.existsByUsername.mockResolvedValue(true);
			await expect(
				UserService.updateUser("alice", { newUsername: "bob" }),
			).rejects.toThrow(ConflictError);
		});

		test("updates user fields and calls repository", async () => {
			userRepository.findByUsername.mockResolvedValue({ username: "alice" });
			userRepository.existsByUsername.mockResolvedValue(false);
			userRepository.update.mockResolvedValue({
				username: "alice",
				name: "Alice Updated",
				email: "alice@example.com",
				role: "ADMIN",
			});
			const updateData = {
				name: "Alice Updated",
				role: "admin",
			};
			const result = await UserService.updateUser("alice", updateData);
			expect(userRepository.update).toHaveBeenCalledWith("alice", {
				name: "Alice Updated",
				role: "ADMIN",
			});
			expect(result.name).toBe("Alice Updated");
			expect(result.role).toBe("ADMIN");
		});

		test("updates username if newUsername provided", async () => {
			userRepository.findByUsername.mockResolvedValue({ username: "alice" });
			userRepository.existsByUsername.mockResolvedValue(false);
			userRepository.update.mockResolvedValue({
				username: "alice2",
				name: "Alice",
				email: "alice@example.com",
				role: "USER",
			});
			const updateData = {
				newUsername: "alice2",
			};
			const result = await UserService.updateUser("alice", updateData);
			expect(userRepository.update).toHaveBeenCalledWith("alice", {
				username: "alice2",
			});
			expect(result.username).toBe("alice2");
		});
	});
});
