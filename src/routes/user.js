const { Router } = require("express");
const UserControllers = require("../controllers/user");

const router = Router();

router.post("/", (req, res) => UserControllers.createUser(req, res));
router.get("/", (req, res) => UserControllers.readAllUsers(req, res));
router.get("/:id", (req, res) => UserControllers.readOneUser(req, res));

router.patch("/:id", (req, res) => UserControllers.updateUserInfo(req, res));
router.patch("/:id", (req, res) => UserControllers.updatePassword(req, res));
router.patch("/:id", (req, res) => UserControllers.updatePhotoUrl(req, res));


module.exports = router;
