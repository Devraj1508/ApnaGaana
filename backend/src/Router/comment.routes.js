const express = require("express");
const commentsRouter = express.Router();
const commentsController = require("../Controllers/commentscontroller");
const middleware = require("../middleware/middleware");

commentsRouter.post("/comment/:id", middleware, commentsController.addComment);
commentsRouter.get("/comments/:id", commentsController.getComments);
commentsRouter.delete("/comment/:id", middleware, commentsController.deleteComment);
commentsRouter.put("/comment/:id", middleware, commentsController.updateComment);   


module.exports = commentsRouter;