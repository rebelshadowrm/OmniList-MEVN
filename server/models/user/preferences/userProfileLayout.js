const mongoose = require('mongoose')
const UserProfile = require('../userProfile').schema

const userProfileLayoutSchema = new mongoose.Schema({
    profile: {
        type: UserProfile,
        required: false,
        default: () => {}
    },
    layout: {
        type: [],
        required: false,
        default: () => []
    },
    preferences: {
        type: [],
        required: false,
        default: () => []
    }

})


module.exports = mongoose.model('UserProfileLayoutModel', userProfileLayoutSchema)