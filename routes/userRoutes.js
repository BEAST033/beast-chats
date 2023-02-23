const express = require("express");
const { getUser, upsertUser } = require("./../controllers/userController");

const router = express.Router();

router.route("/:phone").get(getUser);
router.route("/").patch(upsertUser);

module.exports = router;
