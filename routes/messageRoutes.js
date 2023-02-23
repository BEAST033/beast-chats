const express = require("express");
const {
  createMessage,
  getAllMessages,
  updateMessage,
  getMessagesInfo,
} = require("./../controllers/messageController");

const router = express.Router();

router.route("/").get(getAllMessages).post(createMessage).patch(updateMessage);
router.route("/:id").get(getMessagesInfo);

module.exports = router;
