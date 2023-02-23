require("dotenv").config({ path: `${__dirname}/config.env` });
const mongoose = require("mongoose");
const socket = require("socket.io");

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception");
  console.log("Error Name: " + err.name);
  console.log("Error Message: " + err.message);
  process.exit(1);
});

const app = require("./app");

const db = process.env.DATABASE_URL.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
).replace("<dbname>", process.env.DATABASE_NAME);

mongoose
  .connect(db)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log("DB connection unsuccessful");
    console.log("Error Name: " + err.name);
    console.log("Error Message: " + err.message);
    server.close(() => {
      process.exit(1);
    });
  });

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection");
  console.log("Error Name: " + err.name);
  console.log("Error Message: " + err.message);
  server.close(() => {
    process.exit(1);
  });
});

const io = socket(server, {
  cors: {
    // 3000
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    socket.userId = userId;

    if (userId) {
      onlineUsers.set(userId, socket.id);
    }
  });

  socket.on("emit-all-read", (data) => {
    const sendUserSocket = onlineUsers.get(data.sender);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("all-read", data.blueTickId);
    }
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.contactId);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", {
        message: data.message,
        receiver: data.contactId,
        sender: data.sender,
        contact: data.contact,
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.userId);
  });
});
