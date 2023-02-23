const express = require("express");
const {
  createContact,
  getAllContacts,
} = require("./../controllers/contactController");

const router = express.Router();

router.route("/").post(createContact).get(getAllContacts);

module.exports = router;
