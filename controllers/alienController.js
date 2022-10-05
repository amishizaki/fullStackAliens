/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
const express = require("express") // import express
const Alien = require("../models/aliens")

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// Here, we're going to set up a seed route
// this will seed our database for us, so we have some starting resources
// there are two ways we're going to talk about seeding a db
// routes -> they work, but they're not best practices
// seed scripts -> they work, and they are best practices
router.get("/base", (req, res) => {
    // array of starter aliens
    const startAliens = [
        { species: "Wookie", planet: "Kashyyyk", friendly: false, discovered: 1977 },
        { species: "Vulcans", planet: "Vulcan", friendly: true, discovered: 1966 },
        { species: "Klingon", planet: "Klingonii", friendly: false, discovered: 1967 },
        { species: "Kryptonians", planet: "Krypton", friendly: true, discovered: 1933 },
        { species: "Gallifreyans", planet: "Gallifrey", friendly: true, discovered: 1963 }
    ]
    
    // Delete all extra aliens
    Alien.deleteMany({}).then((data) => {
        // Base Starter Aliens
        Alien.create(startAliens)
        .then((data) => {
            // send created aliens as response to confirm creation
            res.json(data)
        })
    })
})

// GET request
// index route -> shows all instances of a document in the db
router.get("/", (req, res) => {
    // in our index route, we want to use mongoose model methods to get our data
    Alien.find({})
        .then(aliens => {
            // this is fine for initial testing
            // res.send(aliens)
            // this the preferred method for APIs
            res.json({ aliens: aliens })
        })
        .catch(err => console.log(err))
})

// SHOW request
// read route -> finds and displays a single resource
router.get("/:id", (req, res) => {
    const id = req.params.id
    Alien.findById(id)
        .then(alien => {
            console.log('the alien from the search',alien)
            // update success is called '204 - no content'
            res.json({aliens: alien})
        })
        .catch(err => console.log(err))
})

// POST request
// create route -> gives the ability to create new aliens
router.post("/", (req, res) => {
    // here, we'll get something called a requet body
    // inside this function, that will be referred to as req.body
    // we'll use the mongoose model method `create` to make a new alien
    Alien.create(req.body)
        .then(alien => {
            // send the user a '201 created' response, along with the new alien 
            res.status(201).json({alien: alien.toObject() })
        })
        .catch(error => console.log(error))
})

// PUT request
// update route -> updates a specific alien
router.put("/:id", (req, res) => {
    // console.log("I hit the update route", req.params)
    const id = req.params.id
    
    // for now we'll use a simple mongoose model method, eventually we'll update this (and all) routes and we'll use a different method
    // we're using findByIdAndUpdate, which needs three arguments
    // it needs an id, it needs the req.body, and whether the info is new
    Alien.findByIdAndUpdate(id, req.body, {new: true})
        .then(alien => {
            console.log('the alien from update',alien)
            // update success is called '204 - no content'
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})

// Delete request
// destroy route -> finds and deletes a single resource (alien)
router.delete("/:id", (req, res) => {
    // grab the id from the request
    const id = req.params.id
    // find and delete the alien
    Alien.findByIdAndRemove(id)
    // send a 204 if successful
        .then(() => {
            res.sendStatus(204)
        })
        // send the error if not
        .catch(err => res.json(err))
})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router