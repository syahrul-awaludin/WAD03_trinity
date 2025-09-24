const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller"); // .js extension if needed

router.post("/users", userController.createUser);
router.get("/users", userController.getUsers);
router.get("/users/:username", userController.getUserByUsername);
router.patch("/users/:username", userController.updateUser);

module.exports = router;
