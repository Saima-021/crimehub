const express = require("express");
const router = express.Router();

const { detectSpamEmail } = require("../controllers/spamController");

router.post("/", detectSpamEmail);

module.exports = router;