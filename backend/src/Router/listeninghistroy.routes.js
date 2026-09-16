const express = require("express");
const listeninghistoryRouter = express.Router();
const listninghistoryController = require("../Controllers/listeninghistorycontroller");
const middleware = require("../middleware/middleware");

listeninghistoryRouter.post("/record", middleware, listninghistoryController.recordsongplay);
listeninghistoryRouter.get("/history", middleware, listninghistoryController.getlisteninghistory);

module.exports = listeninghistoryRouter;