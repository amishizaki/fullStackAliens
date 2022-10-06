/////////////////////////////////////////////
// Our schema and model for the alien resource
/////////////////////////////////////////////
// this is the old mongoose export
// const mongoose = require("mongoose") // import mongoose
const mongoose = require('./connection') // import mongoose
const User = require('./user')

// here we'll import our commentSchema
const commentSchema = require('./comment')

// we're going to pull the Schema and model from mongoose
// we'll use a syntax use "destructuring"
const { Schema, model } = mongoose

// alien schema
const alienSchema = new Schema({
    species: String,
    planet: String,
    friendly: Boolean,
    discovered: Number,
    owner: {
        // here we can refer to an objectId
        // by declaring that as the type
        type: Schema.Types.ObjectId,
        // this line, tells us to refer to the User model
        ref: 'User'
    },
    comments: [commentSchema]
}, { timestamps: true})

// make the fruit model
// the model method takes two args
// the first is what we will call our model
// the second is what we will use to build the model
const Alien = model("Alien", alienSchema)

/////////////////////////////////////////////
// Export our model
/////////////////////////////////////////////
module.exports = Alien