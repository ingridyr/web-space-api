require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const userRouter = require("./app/routes/user");
const postRouter = require("./app/routes/post");
const authRouter = require("./app/routes/auth");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/auth", authRouter);


module.exports = app;
