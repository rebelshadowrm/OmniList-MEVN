const mongoose = require('mongoose')
const AnimeList = require('../../animeList').schema

const userListPreferencesSchema = new mongoose.Schema({
    animeList: {
        type: AnimeList,
        required: false,
        default: () => {}
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