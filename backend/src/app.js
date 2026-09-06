const express = require("express");
const cookieParser = require("cookie-parser");

const authRouter = require("./Router/auth.routes");
const userprofileRouter = require("./Router/userprofile.routes");
const followuserRouter = require("./Router/follow.routes");
const SongsRouter = require("./Router/songs.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userprofileRouter);
app.use("/api/follow", followuserRouter);
app.use("/api/songs", SongsRouter);

//changing the one line to two lines for better readability
module.exports = app;