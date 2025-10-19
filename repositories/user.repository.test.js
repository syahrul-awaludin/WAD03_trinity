// This test suite mocks the Prisma client to test the userRepository functions in isolation.
// It verifies CRUD operations and existence checks for user data using a mock in-memory array.

jest.mock("./prisma", () => {
	// Mocked user data and Prisma methods for testing

	let users = [
		{ username: "alice", email: "alice@example.com", name: "Alice" },
		{ username: "bob", email: "bob@example.com", name: "Bob" },
	];

	return {
		user: {
			// Returns a copy of all users
			findMany: jest.fn(() => Promise.resolve(users.slice())),
			// Finds a user by username, returns user object or null
			findUnique: jest.fn(({ where }) =>
				Promise.resolve(
					users.find((u) => u.username === where.username) || null,
				),
			),
			// Adds a new user to the array and returns it
			create: jest.fn(({ data }) => {
				users.push({ ...data });
				return Promise.resolve(data);
			}),
			// Updates an existing user by username and returns updated user
			update: jest.fn(({ where, data }) => {
				const idx = users.findIndex((u) => u.username === where.username);
				if (idx === -1) throw new Error("User not found");
				users[idx] = { ...users[idx], ...data };
				return Promise.resolve(users[idx]);
			}),
		},
		// Sets the mock user data to a new array
		__setData: (arr) => {
			users = arr.slice();
		},
		// Clears the mock user data
		__reset: () => {
			users = [];
		},
	};
});

const userRepository = require("./user.repository");
const prisma = require("./prisma");

describe("UserRepository (jest mock prisma)", () => {
	// beforeEach: Reset mock data before each test to ensure isolation
	beforeEach(() => {
		prisma.__setData([
			{ username: "alice", email: "alice@example.com", name: "Alice" },
			{ username: "bob", email: "bob@example.com", name: "Bob" },
		]);
	});

	// afterEach: Clear mock data after each test
	afterEach(() => {
		prisma.__reset();
	});

	test("findAll returns all users", async () => {
		// Calls userRepository.findAll and expects all users to be returned
		const users = await userRepository.findAll();
		expect(Array.isArray(users)).toBe(true);
		expect(users).toHaveLength(2);
		expect(users.find((u) => u.username === "alice")).toBeDefined();
	});

	test("findByUsername returns the correct user", async () => {
		// Calls userRepository.findByUsername and expects correct user object
		const user = await userRepository.findByUsername("alice");
		expect(user).not.toBeNull();
		expect(user.username).toBe("alice");
		expect(user.email).toBe("alice@example.com");
	});

	test("existsByUsername returns true when user exists and false otherwise", async () => {
		// Calls userRepository.existsByUsername and expects true/false based on existence
		expect(await userRepository.existsByUsername("alice")).toBe(true);
		expect(await userRepository.existsByUsername("charlie")).toBe(false);
	});

	test("create adds a new user", async () => {
		// Calls userRepository.create to add a new user and checks if added
		const newUser = {
			username: "charlie",
			email: "charlie@example.com",
			name: "Charlie",
		};
		const created = await userRepository.create(newUser);
		expect(created).toMatchObject(newUser);

		const all = await userRepository.findAll();
		expect(all).toHaveLength(3);
		expect(all.find((u) => u.username === "charlie")).toBeDefined();
	});

	test("update modifies an existing user", async () => {
		// Calls userRepository.update to modify a user and checks if updated
		const updated = await userRepository.update("alice", {
			email: "alice+updated@example.com",
			name: "Alice Updated",
		});
		expect(updated.email).toBe("alice+updated@example.com");
		expect(updated.name).toBe("Alice Updated");

		const fromDb = await userRepository.findByUsername("alice");
		expect(fromDb.email).toBe("alice+updated@example.com");
	});
});
