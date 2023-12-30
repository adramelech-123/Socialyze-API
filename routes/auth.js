const express = require("express");
const User = require("../models/User")
const bcrypt = require("bcrypt")

router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  
  try {
    // Check all fields entered
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).json({
        message: "Send all required fields!",
      });
    }
    // Generate Hashed Password with bcrypt
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save user & return response
    const user = await newUser.save()
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }

});

// Login User
router.post("/login", async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    !user &&
      res.status(404).json({
        message: "User not found! 🚩",
      });

   // Check if password is valid against the encrypted password
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json({
      message: "Wrong username or password!⛔"
    })

    res.status(200).json(user)
  } catch (err) {
   res.status(500).json({
    message: err.message
   })
  }
  
})

module.exports = router;