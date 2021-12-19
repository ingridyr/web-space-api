const User = require("../models/user");

class UserControllers {
  static async createUser(req, res) {
    try {
      const { email, username, phone } = req.body;
      if (await User.findOne({ email })) {
        return res.status(409).json({"error": "User email already exists."});
      }
      if (await User.findOne({ username })) {
        return res.status(409).json({"error": "Username already exists."});
      }
      if (await User.findOne({ phone })) {
        return res.status(409).json({"error": "User phone number already exists."});
      }

      const userBody = req.body;
      
      const user = await User.create(userBody);
      user.password = undefined

      return res.status(201).json(user);

    } catch (err) {
      return res.status(400).json({
        error: err,
      });
    }
  }
}

module.exports = UserControllers;
