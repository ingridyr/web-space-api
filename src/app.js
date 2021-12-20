require("dotenv").config();
const express = require("express");

const userRouter = require("./app/routes/user");
const postRouter = require("./app/routes/post");
const authRouter = require("./app/routes/auth");

const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/auth", authRouter);

module.exports = app;
