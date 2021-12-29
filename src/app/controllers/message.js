const Message = require("../models/message");
const User = require("../models/user");
const Helpers = require("../utils/helpers");

class MessageControllers {
  static async createMessage(req, res) {
    try {
      const { conversationId, senderId, text } = req.body;
      const message = await Message.create({
        conversationId,
        senderId,
        text,
      });
      res.status(201).json(message);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async readMessages(req, res) {
    try {
      const { id } = req.params;
      const messages = await Message.find({
        conversationId: id,
      });
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = MessageControllers;
