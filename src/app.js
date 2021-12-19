const express = require("express");

const user = require("./routes/user")
const postRouter = require("./routes/post")

const app = express();

app.use("/user", user)
app.use("/post", postRouter)

module.exports = app;
