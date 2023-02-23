const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const contactRouter = require("./routes/contactRoutes");
const messageRouter = require("./routes/messageRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/messages", messageRouter);

module.exports = app;
