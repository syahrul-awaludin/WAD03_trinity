const userService = require("../services/user.service");
const userController = require("./user.controller");
const {
	BadRequestError,
	UnprocessableEntityError,
	NotFoundError,
	ConflictError,
} = require("../utils/errors");

jest.mock("../services/user.service");

describe("UserController", () => {
	let req, res, next;

	beforeEach(() => {
		req = {};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		next = jest.fn();
		jest.clearAllMocks();
	});

	describe("createUser", () => {
		test("returns 201 and user on success", async () => {
			req.body = {
				username: "bob",
				name: "Bob",
				email: "bob@example.com",
				role: "buyer",
			};
			const user = { ...req.body, role: "BUYER" };
			userService.createUser.mockResolvedValue(user);

			await userController.createUser(req, res, next);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({ success: true, user });
		});

		test("calls next with BadRequestError if body missing", async () => {
			req.body = undefined;
			await userController.createUser(req, res, next);
			expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
		});

		test("calls next with UnprocessableEntityError if validation fails", async () => {
			req.body = { username: "", name: "", email: "bademail", role: "admin" };
			await userController.createUser(req, res, next);
			expect(next).toHaveBeenCalledWith(expect.any(UnprocessableEntityError));
		});

		test("calls next on service error", async () => {
			req.body = {
				username: "bob",
				name: "Bob",
				email: "bob@example.com",
				role: "buyer",
			};
			const err = new ConflictError("Username exists");
			userService.createUser.mockRejectedValue(err);
			await userController.createUser(req, res, next);
			expect(next).toHaveBeenCalledWith(err);
		});
	});

	describe("getUsers", () => {
		test("returns users on success", async () => {
			const users = [{ username: "alice" }, { username: "bob" }];
			userService.getAllUsers.mockResolvedValue(users);
			await userController.getUsers(req, res, next);
			expect(res.json).toHaveBeenCalledWith({ success: true, users });
		});

		test("calls next on service error", async () => {
			const err = new Error("fail");
			userService.getAllUsers.mockRejectedValue(err);
			await userController.getUsers(req, res, next);
			expect(next).toHaveBeenCalledWith(err);
		});
	});

	describe("getUserByUsername", () => {
		test("returns user on success", async () => {
			req.params = { username: "alice" };
			const user = { username: "alice" };
			userService.getUserByUsername.mockResolvedValue(user);
			await userController.getUserByUsername(req, res, next);
			expect(res.json).toHaveBeenCalledWith({ success: true, user });
		});

		test("calls next with BadRequestError if username missing", async () => {
			req.params = {};
			await userController.getUserByUsername(req, res, next);
			expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
		});

		test("calls next on service error", async () => {
			req.params = { username: "alice" };
			const err = new NotFoundError("not found");
			userService.getUserByUsername.mockRejectedValue(err);
			await userController.getUserByUsername(req, res, next);
			expect(next).toHaveBeenCalledWith(err);
		});
	});

	describe("updateUser", () => {
		test("returns updated user on success", async () => {
			req.params = { username: "alice" };
			req.body = { name: "Alice Updated" };
			const user = { username: "alice", name: "Alice Updated" };
			userService.updateUser.mockResolvedValue(user);
			await userController.updateUser(req, res, next);
			expect(res.json).toHaveBeenCalledWith({ success: true, user });
		});

		test("calls next with BadRequestError if body missing", async () => {
			req.params = { username: "alice" };
			req.body = undefined;
			await userController.updateUser(req, res, next);
			expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
		});

		test("calls next with BadRequestError if username missing", async () => {
			req.params = {};
			req.body = { name: "Alice Updated" };
			await userController.updateUser(req, res, next);
			expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
		});

		test("calls next with UnprocessableEntityError if validation fails", async () => {
			req.params = { username: "alice" };
			req.body = { email: "bademail", role: "admin" };
			await userController.updateUser(req, res, next);
			expect(next).toHaveBeenCalledWith(expect.any(UnprocessableEntityError));
		});

		test("calls next on service error", async () => {
			req.params = { username: "alice" };
			req.body = { name: "Alice Updated" };
			const err = new NotFoundError("not found");
			userService.updateUser.mockRejectedValue(err);
			await userController.updateUser(req, res, next);
			expect(next).toHaveBeenCalledWith(err);
		});
	});
});
