const express = require('express');
const { AuthController } = require('../controllers/authController');
const authRouter = express.Router();

const authController = new AuthController()

authRouter.get("/login", authController.loginUserPage);
authRouter.get("/register", authController.registerUserPage);
authRouter.post("/register", authController.registerUser)
authRouter.post("/login", authController.loginUser)
authRouter.post("/logout", authController.logoutUser)

module.exports = authRouter