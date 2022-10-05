///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const Fruit = require('./aliens')

// Here, we're going to set up a seed script
// this will seed our database for us, so we have some starting resources
// This script will be run, with the command in the terminal `npm run seed`

///////////////////////////////////////
// Seed Script code
///////////////////////////////////////
// first we need our connection saved to a variable for easy reference
const db = mongoose.connection

db.on('open', () => {
    const startAliens = [
        { species: "Wookie", planet: "Kashyyyk", friendly: false, discovered: 1977 },
        { species: "Vulcans", planet: "Vulcan", friendly: true, discovered: 1966 },
        { species: "Klingon", planet: "Klingonii", friendly: false, discovered: 1967 },
        { species: "Kryptonians", planet: "Krypton", friendly: true, discovered: 1933 },
        { species: "Gallifreyans", planet: "Gallifrey", friendly: true, discovered: 1963 }
    ]
    // Delete all extra aliens
    Alien.deleteMany({})
        .then(deletedAliens => {
            console.log('this is what .deleteMany returns', deletedAliens)
            
            // create a bunch of new aliens from startAliens
            Alien.create(startAliens)
                .then(data => {
                    console.log('here are the newly created aliens', data)
                    // always close connection to the db
                    db.close()
                })
                .catch(error => {
                    console.log(error)
                    //always close connection to the db
                    db.close()
                })
        })
        .catch(error => {
            console.log(error)
            // always close connection to db
            db.close()
        })
})



