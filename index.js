// Import essential libraries
const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")

// Import Routes
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");

// Configure Express App and Environment Variables
const app = express()
dotenv.config()
PORT = process.env.PORT

// Middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

// Routes
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);



// Connect to DB
mongoose
  .connect(process.env.MONGO_URI_LOCAL)
  .then(() => {
    console.log("App connected to database! 💃");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });