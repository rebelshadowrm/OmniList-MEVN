const mongoose = require('mongoose')
const timestamp = require("../plugins/timestamp");
const validator = require('validator').default
const UserPreferences = require('./userPreferences').schema
const UserProfile = require('./userProfile').schema

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value)
            }
        }
    },
    role: {
        type: String,
        uppercase: true,
        default: () => 'user'
    },
    userPreferences: {
        type: UserPreferences,
        required: false,
        ref: 'UserPreferencesModel',
        default: () => {}
    },
    userProfile: {
        type: UserProfile,
        required: false,
        ref: 'UserProfileModel',
        default: () => {}
    },
}, {
    collection: 'users'
})
 userSchema.plugin(timestamp)

module.exports = mongoose.model('UserModel', userSchema)