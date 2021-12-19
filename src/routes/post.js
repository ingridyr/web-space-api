const { Router } = require("express");
const PostControllers = require("../controllers/post");

const router = Router();

// use middlewares here

router.get("", (req, res) => PostControllers.readAllPosts(req, res));
router.get("/:id", (req, res) => PostControllers.readOnePost(req, res));

router.post("", (req, res) => PostControllers.createPost(req, res));

router.patch("/:id", (req, res) => PostControllers.updatePost(req, res));
router.patch("/:id/likes", (req, res) => PostControllers.updatePostLikes(req, res));
router.patch("/:id/commets", (req, res) => PostControllers.updatePostComments(req, res));

router.delete("/:id", (req, res) => PostControllers.deletePost(req, res));

module.exports = router