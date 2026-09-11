const express = require("express");
const listeninghistoryRouter = express.Router();
const listninghistoryController = require("../Controllers/listeninghistorycontroller");

listeninghistoryRouter.post("/record", listninghistoryController.recordsongplay);
listeninghistoryRouter.get("/history", listninghistoryController.getlisteninghistory);

module.exports = listeninghistoryRouter;