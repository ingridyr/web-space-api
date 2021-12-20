const jwt = require("jsonwebtoken");
const authConfig = require("../../config/authConfig.json");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ error: "Token format error" });
  }
  const [bearer, token] = parts;
  if (!/^Bearer$/i.test(bearer)) {
    return res.status(401).json({ error: "Missing Bearer" });
  }
  jwt.verify(token, authConfig.secret, (error, decoded) => {
    if (error) {
      return res.status(401).json({ error: "Token invalid" });
    }
    req.userId = decoded.userId;
    return next();
  });
};
