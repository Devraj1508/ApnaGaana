const express = require("express");
const likesrouter = express.Router();
const likescontroller = require("../Controllers/likescontroller");
const middleware = require("../middleware/middleware");

likesrouter.post("/like/:id", middleware, likescontroller.likeSong);
likesrouter.get("/likes/:id", middleware, likescontroller.getlikes);
module.exports = likesrouter;