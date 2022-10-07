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
    Alien.deleteMany({})
        .then(() => {
        // Seed Starter Aliens
        Alien.create(startAliens)
        .then(data => {
            res.json(data)
        })
    })
})

// GET request
// index route -> shows all instances of a document in the db
router.get("/", (req, res) => {
    // in our index route, we want to use mongoose model methods to get our data
    Alien.find({})
        .populate("comments.author", "username")
        .then(aliens => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // this is fine for initial testing
            // res.send(aliens)
            // this the preferred method for APIs
            // res.json({ aliens: aliens })
            res.render('aliens/index', { aliens, username, loggedIn, userId })
        })
        .catch(err => console.log(err))
})

// SHOW request
// read route -> finds and displays a single resource
router.get("/:id", (req, res) => {
    const id = req.params.id

    Alien.findById(id)
        // populate will provide more data about the document that is in the specified collection
        // the first arg is the field to populte
        // the second can specify which parts to keep or which to remove
        // .populate("owner", "username")
        // we can also populate fields of our subdocuments
        .populate('comments.author', 'username')
        .then(alien => {
            // console.log('the alien from the search',alien)
            // update success is called '204 - no content'
            res.json({alien: alien})
        })
        .catch(err => console.log(err))
})

// POST request
// create route -> gives the ability to create new aliens
router.post("/", (req, res) => {
    // here, we'll get something called a request body
    // inside this function, that will be referred to as req.body
    // this is going to add ownership, via a foreign key reference, to our aliens
    // bascially, all we have to do, is append our request body, with the 'owner' field, and set the value tothe logged in user's id
    req.body.owner = req.session.userId
    // we'll use the mongoose model method `create` to make a new alien
    Alien.create(req.body)
        .then(alien => {
            // send the user a '201 created' response, along with the new alien 
            res.status(201).json({ alien: alien.toObject() })
        })
        .catch(error => console.log(error))
})

// GET request
// only aliens owned by logged in user
// we're going to build another route, that is owner specific, to list all the aliens owned by a certain (logged in) user
router.get('/mine', (req, res) => {
    // find the aliens by ownership
    Alien.find({ owner: req.session.userId })
    // then display the aliens
        .then(aliens => {
            res.status(200).json({ aliens: aliens })
        })
    // or throw and error if there is one
        .catch(error => res.json(error))

})


// PUT request
// update route -> updates a specific alien
router.put("/:id", (req, res) => {
    // console.log("I hit the update route", req.params)
    const alienId = req.params.id
    // for now we'll use a simple mongoose model method, eventually we'll update this (and all) routes and we'll use a different method
    // we're using findByIdAndUpdate, which needs three arguments
    // it needs an id, it needs the req.body, and whether the info is new
    Alien.findById(alienId)
        .then(alien => {
            if (alien.owner == req.session.userId) {
                return alien.updateOne(req.body)
            }
        })
        .then(alien => {
            console.log('the updated alien',alien)
            // update success is called '204 - no content'
            res.sendStatus(401)
        })
        .catch(err => console.log(err))
})

// Delete request
// destroy route -> finds and deletes a single resource (alien)
router.delete("/:id", (req, res) => {
    // grab the id from the request
    const id = req.params.id
    // find and delete the alien
    Alien.findById(id)
    // send a 204 if successful
        .then(alien => {
            if (alien.owner == req.session.userId) {
                // if successful, send a status and delete the alien
                res.sendStatus(204)
                return alien.deleteOne()
            } else {
                res.sendStatus(401)
            }
        })
        // send the error if not
        .catch(err => res.json(err))
})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router