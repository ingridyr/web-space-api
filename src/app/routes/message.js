const router = require("express").Router();
const Message = require("../controllers/message");

router.post("/", (req, res) => Message.createMessage(req, res));

router.get("/:id", (req, res) => Message.readMessages(req, res));

module.exports = router;