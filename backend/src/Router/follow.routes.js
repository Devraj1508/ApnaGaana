const express = require("express");
const followuserRouter=express.Router();
const followuserController=require("../Controllers/followusercontroller");
const middleware=require("../middleware/middleware");

followuserRouter.post("/follow/:id", middleware, followuserController.followUser);
followuserRouter.get("/followers", middleware, followuserController.getfollowers);
followuserRouter.get("/following", middleware, followuserController.getfollowing);
followuserRouter.delete("/unfollow/:id", middleware, followuserController.unfollowUser);

module.exports = followuserRouter;