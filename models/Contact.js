const mongoose = require("mongoose");
const User = require("../models/User");

mongoose.set("strictQuery", false);

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, "User ID is required"],
    ref: "User",
  },
  contact: {
    type: String,
    required: [true, "Contact's Phone Number is required"],
    trim: true,
  },
  name: {
    type: String,
    required: [true, "Contact's Name is required"],
    trim: true,
    minLength: 3,
  },
  isSaved: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

contactSchema.pre("save", async function (next) {
  const user = await User.findById(this.user).select({ phone: 1, _id: 0 });
  if (user.phone === this.contact) {
    throw new Error(`${user.phone} is your Phone Number.`);
  }

  if (this.isNew) {
    const contact = await Contact.find({
      user: this.user,
      contact: this.contact,
    });
    if (contact.length !== 0) {
      throw new Error(`${this.contact} is already in your contacts`);
    }
  }

  next();
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
