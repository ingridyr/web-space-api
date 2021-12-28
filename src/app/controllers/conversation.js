const Conversation = require("../models/conversation");
const Helpers = require("../utils/helpers");

class ConversationControllers {
  static async createConversation(req, res) {
    try {
      const { senderId, receiverId } = req.body;

      const conversations = await Conversation.find();
      const members = conversations.find(item => item.members[1] === receiverId)

      if (members) {
        return res.status(400).json({"msg": "conversation already created"})
      }

      const conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
      
      return res.status(201).json(conversation);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  static async readAllConversations(req, res) {
    try {
      const { page, perPage } = req.query;
      const conversations = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      return res.status(200).json(Helpers.paginateData(conversations, page, perPage));
    } catch (err) {
      return res.status(400).json(err);
    }
  }
}

module.exports = ConversationControllers;
