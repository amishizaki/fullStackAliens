////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Alien = require("../models/aliens")

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// GET request
// index route -> shows all instances of a document in the db
router.get("/", (req, res) => {
    // console.log("this is the request", req)
    // in our index route, we want to use mongoose model methods to get our data
    Alien.find({})
        .populate("comments.author", "username")
        .then(aliens => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // console.log(aliens)
            // this is fine for initial testing
            // res.send(aliens)
            // this the preferred method for APIs
            // res.json({ aliens: aliens })
            // here, we're going to render a page, but we can also send data that we got from the database to that liquid page for rendering
            res.render('aliens/index', { aliens, username, loggedIn, userId })
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

// GET for new alien
// renders the form to create a alien
router.get('/new', (req, res) => {
    const username = req.session.username
    const loggedIn = req.session.loggedIn
    const userId = req.session.userId

    res.render('aliens/new', { username, loggedIn, userId })
})
// POST request
// create route -> gives the ability to create new aliens
router.post("/", (req, res) => {
    // bc our checkboxes dont send true or false(which they totally should but whatev)
    // we need to do some js magic to change the value
    // first side of the equals sign says "set this key to be the value"
    // the value comes from the ternary operator, checking the req.body field
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false
    // here, we'll get something called a request body
    // inside this function, that will be referred to as req.body
    // this is going to add ownership, via a foreign key reference, to our aliens
    // basically, all we have to do, is append our request body, with the `owner` field, and set the value to the logged in user's id
    req.body.owner = req.session.userId
    console.log('the alien from the form', req.body)
    // we'll use the mongoose model method `create` to make a new alien
    Alien.create(req.body)
        .then(alien => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // send the user a '201 created' response, along with the new alien
            // res.status(201).json({ alien: alien.toObject() })
            res.redirect('/aliens')
            // res.render('aliens/show', { alien, username, loggedIn, userId })
        })
        .catch(err => res.redirect(`/error?error=${err}`))  
})

// GET request
// only aliens owned by logged in user
// we're going to build another route, that is owner specific, to list all the aliens owned by a certain(logged in) user
router.get('/mine', (req, res) => {
    // find the aliens, by ownership
    Alien.find({ owner: req.session.userId })
    // then display the aliens
        .then(aliens => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId

            // res.status(200).json({ aliens: aliens })
            res.render('aliens/index', { aliens, username, loggedIn, userId })
        })
    // or throw an error if there is one
        .catch(error => res.redirect(`/error?error=${err}`))
})

// GET request to show the update page
router.get("/edit/:id", (req, res) => {
    const username = req.session.username
    const loggedIn = req.session.loggedIn
    const userId = req.session.userId
    // res.send('edit page')

    const alienId = req.params.id

    Alien.findById(alienId)
        // render the edit form if there is a alien
        .then(alien => {
            res.render('aliens/edit', { alien, username, loggedIn, userId })
        })
        // redirect if there isn't
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
    // res.send('edit page')
})

// PUT request
// update route -> updates a specific alien
router.put("/:id", (req, res) => {
    console.log("req.body initially", req.body)
    const id = req.params.id

    req.body.friendly = req.body.friendly === 'on' ? true : false
    console.log('req.body after changing checkbox value', req.body)
    Alien.findById(id)
        .then(alien => {
            if (alien.owner == req.session.userId) {
                // res.sendStatus(204)
                return alien.updateOne(req.body)
            } else {
                res.sendStatus(401)
            }
        })
        .then(() => {
            // console.log('returned from update promise', data)
            res.redirect(`/aliens/${id}`)
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

router.delete('/:id', (req, res) => {
    // get the alien id
    const alienId = req.params.id

    // delete and REDIRECT
    Alien.findByIdAndRemove(alienId)
        .then(alien => {
            // if the delete is successful, send the user back to the index page
            res.redirect('/aliens')
        })
        .catch(error => {
            res.redirect(`/error?error=${err}`)
        })
})

// SHOW request
// read route -> finds and displays a single resource
router.get("/:id", (req, res) => {
    const id = req.params.id

    Alien.findById(id)
        // populate will provide more data about the document that is in the specified collection
        // the first arg is the field to populate
        // the second can specify which parts to keep or which to remove
        // .populate("owner", "username")
        // we can also populate fields of our subdocuments
        .populate("comments.author", "username")
        .then(alien => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // res.json({ alien: alien })
            res.render('aliens/show', { alien, username, loggedIn, userId })
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})


//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router