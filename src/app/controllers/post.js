const Post = require("../models/post");
const User = require("../models/user");
const Helpers = require("../utils/helpers");
const PostImage = require("../models/postImage");


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
        return res.status(404).json({ error: "post not found" });
      }
      return res.status(200).json(post);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  static async createPost(req, res) {
    try {
      const body = req.body;
      let newPhoto;
      
      if (req.file) {
        const { originalname: name, size, key, location: url = "" } = req.file;
        
        const image = await PostImage.create({
          name,
          size,
          key,
          url,
        });

        newPhoto = { url: image.url, photoId: image._id };
      }

      body.photo = newPhoto
      const post = await Post.create(body);
      
      const user = await User.findById(body.user);
      const posts = [...user.posts, post];
      await User.findByIdAndUpdate(body.user, {
        posts,
        new: true,
      });
      return res.status(201).json(post);
    } catch (err) {
      console.log(err)
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
      post.title = title && title;
      post.description = description && description;
      return res.status(200).json(post);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  static async updatePostLikes(req, res) {
    try {
      const id = req.params.id;
      const { userId } = req.body;

      const post = await Post.findById(id);

      if (post.likes.includes(userId)) {
        post.likes = post.likes.filter((item) => item !== userId);
      } else {
        post.likes = [...post.likes, userId];
        post.dislikes = post.dislikes.filter((item) => item !== userId);
      }

      const updatedLike = await Post.findByIdAndUpdate(id, {
        likes: post.likes,
        dislikes: post.dislikes,
        updatedAt: Date.now(),
        new: true,
      });
      updatedLike.likes = post.likes;

      return res.status(200).json(updatedLike);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  static async updatePostDislikes(req, res) {
    try {
      const id = req.params.id;
      const { userId } = req.body;

      const post = await Post.findById(id);

      if (post.dislikes.includes(userId)) {
        post.dislikes = post.dislikes.filter((item) => item !== userId);
      } else {
        post.dislikes = [...post.dislikes, userId];
        post.likes = post.likes.filter((item) => item !== userId);
      }

      const updatedLike = await Post.findByIdAndUpdate(id, {
        likes: post.likes,
        dislikes: post.dislikes,
        updatedAt: Date.now(),
        new: true,
      });
      updatedLike.likes = post.likes;

      return res.status(200).json(updatedLike);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
  static async updatePostComments(req, res) {
    try {
      const id = req.params.id;
      const { comment, userId } = req.body;

      const post = await Post.findById(id);
      const user = await User.findById(userId);

      const newComment = {
        userId: user._id,
        username: user.username,
        userPhoto: user.photoUrl,
        comment,
      };

      const updatedComments = await Post.findByIdAndUpdate(id, {
        comments: [...post.comments, newComment],
        updatedAt: Date.now(),
        new: true,
      });
      updatedComments.comments = [...post.comments, newComment];

      return res.status(200).json(updatedComments);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }
  static async deletePost(req, res) {
    try {
      await Post.findByIdAndRemove(req.params.id);
      return res.status(204).json({});
    } catch (err) {
      return res.status(400).json(err);
    }
  }
}

module.exports = PostControllers;
