const mongoose = require('mongoose')
const MediaList = require('../../mediaList').schema

const userListPreferencesSchema = new mongoose.Schema({
    mediaList: {
        type: MediaList,
        required: false,
        default: undefined
    },
    animeList: {
        type: MediaList,
        required: false,
        default: undefined
    },
    style: {
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


module.exports = mongoose.model('UserListPreferencesModel', userListPreferencesSchema)
