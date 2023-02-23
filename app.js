const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const contactRouter = require("./routes/contactRoutes");
const messageRouter = require("./routes/messageRoutes");

const app = express();

app.use(
  cors({
    origin: "https://resonant-jelly-a5b9b6.netlify.app",
  })
);

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/messages", messageRouter);

module.exports = app;
