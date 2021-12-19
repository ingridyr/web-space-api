const { Router } = require("express");
const UserControllers = require("../controllers/user");

const router = Router();

router.post("/", (req, res) => UserControllers.createUser(req, res));

module.exports = router;
