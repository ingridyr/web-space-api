const router = require("express").Router();
const Conversation = require("../controllers/conversation");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

router.post("/", (req, res) => Conversation.createConversation(req, res));

router.get("/:userId", (req, res) =>
  Conversation.readAllConversations(req, res)
);

module.exports = router;
