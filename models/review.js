const mongoose = require('mongoose');

// REVIEW SCHEMA
const reviewSchema = new mongoose.Schema({
    // Rating for campground
    rating: {
        // Setting the field type
        type: Number,
        // Making the star rating required
        required: "Please provide a rating (1-5 stars).",
        // Defining min and max values
        min: 1,
        max: 5,
        // Adding validation to see if the entry is an integer
        validate: {
            // validator accepts a function definition which it uses for validation
            validator: Number.isInteger,
            message: "{VALUE} is not an integer value."
        }
    },
    // review text
    text: {
        type: String,
    },
    // author id, username, and avatar
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
        avatar: String
    },
    // campground associated with the review
    campground: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campground"
        },
        name: String
    },
}, {
    // if timestamps are set to true, mongoose assigns createdAt and updatedAt fields to your schema, the type assigned is Date.
    timestamps: true
});
module.exports = mongoose.model('Review', reviewSchema);