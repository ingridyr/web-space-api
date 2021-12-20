const Post = require("../models/post");
const User = require("../models/user");
const Helpers = require("../utils/helpers");

class PostControllers {
  static async readAllPosts(req, res) {
    try {
      const { page, perPage } = req.query;
      const posts = await Post.find();
      return res.status(200).json(Helpers.paginateData(posts, page, perPage));
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  static async readOnePost(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({"error": "post not found"})
      }
      return res.status(200).json(post);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  static async createPost(req, res) {
    try {
      const body = req.body;
      const post = await Post.create(body);
      const user = await User.findById(body.user);
      const posts = [...user.posts, post];
      await User.findByIdAndUpdate(body.user, {
        posts,
        new: true,
      });
      return res.status(201).json(post);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  static async updatePost(req, res) {
    try {
      const { title, description } = req.body;
      const post = await Post.findByIdAndUpdate(req.params.id, {
        title,
        description,
        updatedAt: Date.now(),
        new: true,
      });
      post.title = title && title
      post.description = description && description
      return res.status(200).json(post);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  static async updatePostLikes(req, res) {
    try {
      const id = req.params.id;
      const post = await Post.findById(id);
      const updatedLike = await Post.findByIdAndUpdate(id, {
        likes: post.likes + 1,
        updatedAt: Date.now(),
        new: true,
      });
      updatedLike.likes += 1;
      return res.status(200).json(updatedLike);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  static async updatePostComments(req, res) {
    try {
      const id = req.params.id;
      const { comment } = req.body;
      const post = await Post.findById(id);
      const updatedComments = await Post.findByIdAndUpdate(id, {
        comments: [...post.comments, comment],
        updatedAt: Date.now(),
        new: true,
      });
      updatedComments.comments = [...post.comments, comment];
      return res.status(200).json(updatedComments);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  static async deletePost(req, res) {
    try {
      await Post.findByIdAndRemove(req.params.id);
      return res.status(204).json({})
    } catch (err) {
      return res.status(400).json(err);
    }
  }
}

module.exports = PostControllers;