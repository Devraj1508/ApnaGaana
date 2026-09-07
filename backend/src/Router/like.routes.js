const express = require("express");
const likesrouter = express.Router();
const likescontroller = require("../Controllers/likescontroller");
const middleware = require("../middleware/middleware");

likesrouter.post("/like/:id", middleware, likescontroller.likeSong);
likesrouter.get("/likes/:id", middleware, likescontroller.getlikes);
likesrouter.get("/like-status/:id", middleware, likescontroller.getLikeStatus);
likesrouter.delete("/unlike/:id", middleware, likescontroller.unlikeSong);
module.exports = likesrouter;