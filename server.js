/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const express = require("express") // import express
const morgan = require("morgan") // import morgan
// const mongoose = require("mongoose") // import mongoose
const path = require("path") // import path module
const AlienRouter = require("./controllers/alienControllers")
const UserRouter = require("./controllers/userControllers")
const CommentRouter = require("./controllers/commentControllers")
const middleware = require("./utils/middleware")

/////////////////////////////////////////////
// Create our Express Application Object
/////////////////////////////////////////////
// const app = express()
const app = require("liquid-express-views")(express())

/////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////
// our middleware is now being passed through a function in the utils directory
// the middleware function takes one argument, an app and processes the middleware on that argument (which is our app)
middleware(app)

/////////////////////////////////////////////
// Home Route
/////////////////////////////////////////////
app.get("/", (req, res) => {
    // res.send("Your server is running, better go out and catch it!")
    // you can also send html as a string from res.send
    // res.send("<small style='color: red'>Your server is running, better go out and catch it</small>")
    res.render('index.liquid')
})

/////////////////////////////////////////////
// Register our Routes
/////////////////////////////////////////////
// here is where we register our routes, this is how server.js knows to send the appropriate request to the appropriate route and send the correct response
// app.use, when we register a route, needs two arguments
// the first, is the base url endpoint, the second is the file to use
app.use('/aliens', AlienRouter)
app.use('/comments', CommentRouter)
app.use('/users', UserRouter)

/////////////////////////////////////////////
// Server Listener
/////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listening to the sweet sounds of port: ${PORT}`))

// END