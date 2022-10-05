/////////////////////////////////////////////
// Import our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const mongoose = require("mongoose") // import mongoose

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// Setup inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG)

// Events for when connection opens/disconnects/errors
mongoose.connection
  .on("open", () => console.log("Connected to Mongoose"))
  .on("close", () => console.log("Disconnected from Mongoose"))
  .on("error", (error) => console.log(error))

/////////////////////////////////////////////
// Export our connection
/////////////////////////////////////////////
module.exports = mongoose