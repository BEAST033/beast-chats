const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, "Sender's ID is required"],
    ref: "User",
  },
  users: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  message: {
    type: String,
    required: [true, "Message is required"],
    minLength: 1,
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
