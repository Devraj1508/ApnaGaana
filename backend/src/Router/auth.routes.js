const express = require("express");
const authRouter =express.Router();
const authController = require("../Controllers/authcontroller");
const middleware = require("../middleware/middleware");

//authentication based routes
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/me",middleware, authController.getMe);
authRouter.delete("/logout", authController.logout);



module.exports = authRouter;




