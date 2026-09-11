const express = require("express");
const cookieParser = require("cookie-parser");

const authRouter = require("./Router/auth.routes");
const userprofileRouter = require("./Router/userprofile.routes");
const followuserRouter = require("./Router/follow.routes");
const SongsRouter = require("./Router/songs.routes");
const likesRouter  = require("./Router/like.routes");
const commentsRouter = require("./Router/comment.routes");
const playlistRouter = require("./Router/playlist.routes");
const listeninghistoryRouter = require("./Router/listeninghistroy.routes");
const DiscoveryRouter = require("./Router/Discovery.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userprofileRouter);
app.use("/api/follow", followuserRouter);
app.use("/api/songs", SongsRouter);
app.use("/api/likes", likesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/playlists", playlistRouter);
app.use("/api/listening-history", listeninghistoryRouter);
app.use("/api/discovery", DiscoveryRouter);

//changing the one line to two lines for better readability
module.exports = app;