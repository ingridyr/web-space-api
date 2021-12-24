const { Router } = require("express");
const UserControllers = require("../controllers/user");
const authMiddleware = require("../middlewares/auth");
const multer = require("multer");
const multerConfig = require("../../config/multer")

const router = Router();

router.use(authMiddleware);

router.get("/", (req, res) => UserControllers.readAllUsers(req, res));

router.patch("/:id", (req, res) => UserControllers.updateUserInfo(req, res));
router.patch("/:id", (req, res) => UserControllers.updatePassword(req, res));
router.patch("/:id/photo", multer(multerConfig).single("file"), (req, res) => UserControllers.updatePhotoUrl(req, res));
router.get("/:id", (req, res) => UserControllers.readOneUser(req, res));

module.exports = router;
