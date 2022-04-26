const mongoose = require('mongoose')

const userProfileSchema = new mongoose.Schema({
    favorites: {
        animeFavorites: [
            {
                anime: {
                    type: Object,
                    required: false,
                    default: () => {}
                }
            }
        ],
        characterFavorites: [
            {
                character: {
                    type: Object,
                    required: false,
                    default: () => {}
                }
            }
        ],
        staffFavorites: [
            {
                staff: {
                    type: Object,
                    required: false,
                    default: () => {}
                }
            }
        ],
    },
    friends: [
        {
            friend: {
                type: Object,
                required: false
            }
        }
    ],
    socials: [
        {
            socialName: {
                type: String,
                required: false,
                lowercase: true,
            },
            socialType: {
                type: String,
                required: false,
                lowercase: true
            },
            socialValue: {
                type: String,
                required: false,
                lowercase: true
            }
        }
    ]
})

module.exports = mongoose.model('UserProfileModel', userProfileSchema)
