const express = require("express")
const bcrypt = require("bcrypt")
const User = require("../models/User");

router = express.Router()

// Update User
router.put("/:id", async (req, res) => {
    console.log(req.params.id)

    if(req.body.userId === req.params.id || req.body.isAdmin) {
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (err) {
                return res.status(500).json({
                    message: "Error hashing password!"
                })
            }
        }

        try {
          const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
          console.log(user)
          res.status(200).json({
            message: "Account has been succesfully updated!☑️",
          });
        } catch (error) {
          return res.status(500).json({
            message: "Error finding user id"
          });
        }

    } else {
        return res.status(403).json({
            message: "You can update only your account..."
        })
    }
})

// Delete User
router.delete("/:id", async (req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been deleted!")
        } catch (error) {
            return res.status(500).json(error)
        }
    } else {
        return res.status(403).json("You can only delete your account!")
    }
})

// Get User
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const {password, updatedAt, createdAt, ...other} = user._doc

        res.status(200).json(other)
    } catch (error) {
        res.status(500).json(error)
    }
})

// Follow User

router.put("/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push: {followers: req.body.userId}})
                await currentUser.updateOne({ $push: { following: req.params.id } });
                res.status(200).json("User has been followed!")
            } else {
                 res.status(403).json("You already follow this user")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }else {
        res.status(403).json("You cannot follow ")
    }
})

// Unfollow User
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("User has been unfollowed!");
      } else {
        res.status(403).json("😕");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You cannot unfollow yourself ");
  }
});


module.exports = router