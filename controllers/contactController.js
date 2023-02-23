const Contact = require("../models/Contact");
const User = require("../models/User");

exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.findOne({
      user: req.body.user,
      contact: req.body.contact,
    });

    if (contact !== null && contact.isSaved === false) {
      // idar update krna hai contact
      contact.name = req.body.name;
      contact.isSaved = true;
      const updatedContact = await contact.save();

      updatedContact.user = undefined;

      return res.status(200).send({
        status: "success",
        data: {
          contact: updatedContact,
        },
      });
    }

    const newContact = await Contact.create(req.body);
    // idar pair banana hai
    const { phone: pairPhone } = await User.findById(req.body.user);
    const { _id: pairId } = await User.findOne({ phone: req.body.contact });

    await Contact.create({
      contact: pairPhone,
      user: pairId,
      isSaved: false,
      name: pairPhone,
    });

    newContact.user = undefined;

    res.status(201).send({
      status: "success",
      data: {
        contact: newContact,
      },
    });
  } catch (err) {
    if (err.name === "MongooseServerSelectionError")
      err.message = "Slow internet connection";
    res.status(400).send({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.query.userID })
      .select({
        user: 0,
      })
      .sort({ name: 1 });

    res.status(200).send({
      status: "success",
      results: contacts.length,
      data: {
        contacts,
      },
    });
  } catch (err) {
    res.status(404).send({
      status: "fail",
      message: err.message,
    });
  }
};
