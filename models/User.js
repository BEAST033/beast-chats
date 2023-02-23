const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Username is required"],
    minLength: 3,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone Number is required"],
    unique: true,
    trim: true,
  },
  profilePic: {
    type: String,
    trim: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
