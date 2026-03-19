const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.js");

router.get("/signup", usersController.renderSignupForm);
router.post("/signup", usersController.signup);

router.get("/login", usersController.renderLoginForm);
router.post("/login", usersController.login);

router.get("/logout", usersController.logout);

module.exports = router;
