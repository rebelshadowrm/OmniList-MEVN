const mongoose = require('mongoose')


const animeListSchema = new mongoose.Schema({
    list: {
        type: [],
        required: false,
    },
})


module.exports = mongoose.model('AnimeListModel', animeListSchema)
