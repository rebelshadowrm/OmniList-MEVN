const mongoose = require('mongoose')
const AnimeListItem = require('./animeListItem').schema

const animeListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'UserModel'
    },
    list: {
        type: [AnimeListItem],
        required: false,
        ref: 'AnimeListItemModel'
    },
})

module.exports = mongoose.model('AnimeListModel', animeListSchema)
