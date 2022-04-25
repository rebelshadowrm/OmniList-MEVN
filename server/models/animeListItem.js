const mongoose = require('mongoose')
const timestamp = require("./plugins/timestamp");


const animeListItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'UserModel'
    },
    animeId: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        lowercase: true,
        default: () => 'watching'
    },
    progress: {
      type: Number,
      required: true,
      default: () => -1,
    },
    totalEpisodes: {
      type: Number,
      required: true,
      default: () => -1
    },
    rating: {
      type: Number,
      required: true,
      default: () => -1
    },
    image: {
      type: String,
      required: true,
      default: () => 'https://via.placeholder.com/50'
    },
    format: {
        type: String,
        required: false,
    },
    genres: [String]


}, {
    collection: 'listItems'
})
animeListItemSchema.plugin(timestamp)

module.exports = mongoose.model('AnimeListItemModel', animeListItemSchema)
