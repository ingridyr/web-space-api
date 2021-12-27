const Conversation = require("../models/conversation");
const Helpers = require("../utils/helpers");

class ConversationControllers {
  static async createConversation(req, res) {
    try {
      const { senderId, receiverId } = req.body;
      const conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
      res.status(201).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async readAllConversations(req, res) {
    try {
      const { page, perPage } = req.query;
      const conversations = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(Helpers.paginateData(conversations, page, perPage));
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = ConversationControllers;
