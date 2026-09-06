const express = require("express");
const userprofileRouter = express.Router();
const userprofileController = require("../Controllers/userprofilecontroller");
const middleware = require("../middleware/middleware");


userprofileRouter.get("/profile/:id", userprofileController.getUserProfile);
userprofileRouter.put("/profileupdate", middleware, userprofileController.updateUserProfile);

module.exports = userprofileRouter;