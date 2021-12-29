const router = require("express").Router();
const Conversation = require("../controllers/conversation");

router.post("/", (req, res) => Conversation.createConversation(req, res))

router.get("/:userId", (req, res) => Conversation.readAllConversations(req, res));

module.exports = router;