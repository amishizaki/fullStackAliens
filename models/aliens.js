/////////////////////////////////////////////
// Our schema and model for the alien resource
/////////////////////////////////////////////
// this is the old mongoose export
// const mongoose = require("mongoose") // import mongoose
const mongoose = require('./connection') // import mongoose

// we're going to pull the Schema and model from mongoose
// we'll use a syntax use "destructuring"
const { Schema, model } = mongoose

// alien schema
const alienSchema = new Schema({
    species: String,
    planet: String,
    friendly: Boolean,
    discovered: Number
})

const Alien = model("Alien", alienSchema)

/////////////////////////////////////////////
// Export our model
/////////////////////////////////////////////
module.exports = Alien