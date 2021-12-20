const { Router } = require("express");
const UserControllers = require("../controllers/user");

const router = Router();

router.post("/signup", (req, res) => UserControllers.createUser(req, res));
router.post("/signin", (req, res) => UserControllers.login(req, res));


module.exports = router;
