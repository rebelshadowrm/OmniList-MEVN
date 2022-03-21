const mongoose = require('mongoose')

const userProfileSchema = new mongoose.Schema({
    favorites: {
        type: [], //array of arrays?
        required: false,
    },
    friends: {
        type: [], //user array
        required: false,
    }

})

module.exports = mongoose.model('UserProfileModel', userProfileSchema)
