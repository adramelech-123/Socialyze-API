const express = require("express");
const Post = require("../models/Post");

router = express.Router();

// Create Post
router.post("/",  async (req, res) => {
    const newPost = new Post(req.body)

    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(500).json(error)
    }
})

// Update Post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id); //Post ID in the params

        if (post.userId === req.body.userId) {
            await post.updateOne({$set:req.body})
            res.status(200).json('Post has been updated!')
        } else {
          res.status(403).json("Cannot update other users posts!");
        }
    } catch (error) {
        res.status(500).json(error)
    }
    
})

// Delete Post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
        await post.deleteOne()
        res.status(200).json('Post deleted!')
    } else {
      res.status(403).json("Cannot update other users posts!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Like/Unlike Post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)) {
            await post.updateOne({$push: {likes: req.body.userId}})
            res.status(200).json('The post has been liked')
        } else {
            await post.updateOne({$pull: {likes: req.body.userId}})
            res.status(200).json("The post has been unliked");
        }
    } catch (error) {
        res.status(500).json(error)
    }
    
})

// Get Post

// Get timeline Posts

module.exports = router