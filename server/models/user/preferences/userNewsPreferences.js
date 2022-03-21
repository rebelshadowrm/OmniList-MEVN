const mongoose = require('mongoose')
const News = require('../../news').schema

const userNewsPreferencesSchema = new mongoose.Schema({
    news: {
        type: News,
        required: false,
        default: () => {}
    },
    preferences: {
        type: [],
        required: false,
        default: () => []
    }

})


module.exports = mongoose.model('UserNewsPreferencesModel', userNewsPreferencesSchema)