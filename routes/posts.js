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
        const post = await Post.findById(req.params.id);

        if (post.userId === req.body.userId) {
        } else {
          res.status(403).json("Cannot update other users posts!");
        }
    } catch (error) {
        res.status(500).json(error)
    }
    
})

// Delete Post

// Like Post

// Get Post

// Get timeline Posts

module.exports = router