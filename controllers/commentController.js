////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Fruit = require("../models/aliens")

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// POST
// only loggedIn users can post comments
router.post("/:alienId", (req, res) => {
    const alienId = req.params.alienId

    if (req.session.loggedIn) {
        // we want to adjust req.body so that the author is automatically assigned
        req.body.author = req.session.userId
    } else {
        res.sendStatus(401)
    }
    // find a specific alien
    alien.findById(alienId)
        // do something if it works
        //  --> send a success response status and maybe the comment? maybe the alien?
        .then(alien => {
            // push the comment into the alien.comments array
            alien.comments.push(req.body)
            // we need to save the alien
            return alien.save()
        })
        .then(alien => {
            res.status(200).json({ alien: alien })
        })
        // do something else if it doesn't work
        //  --> send some kind of error depending on what went wrong
        .catch(error => console.log(error))
})

// DELETE
// only the author of the comment can delete it
router.delete('/delete/:alienId/:commId', (req, res) => {
    // isolate the ids and save to vars for easy ref
    const alienId = req.params.alienId 
    const commId = req.params.commId
    // get the alien
    Alien.findById(alienId)
        .then(alien => {
            // get the comment
            // subdocs have a built in method that you can use to access specific subdocuments when you need to.
            // this built in method is called .id()
            const theComment = alien.comments.id(commId)
            console.log('this is the comment that was found', theComment)
            // make sure the user is logged in
            if (req.session.loggedIn) {
                // only let the author of the comment delete it
                if (theComment.author == req.session.userId) {
                    // find some way to remove the comment
                    // here's another built in method
                    theComment.remove()
                    alien.save()
                    res.sendStatus(204)
                    // return the saved alien
                    // return alien.save()
                } else {
                    res.sendStatus(401)
                }
            } else {
                res.sendStatus(401)
            }
        })
        // send an error if error
        .catch(error => console.log(error))

})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router