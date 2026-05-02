const mongoose = require('mongoose')
const timestamp = require("./plugins/timestamp");

const entityRefSchema = new mongoose.Schema({
    provider: {
        type: String,
        required: false,
        uppercase: true,
    },
    domain: {
        type: String,
        required: false,
        uppercase: true,
    },
    externalId: {
        type: String,
        required: false,
    },
    key: {
        type: String,
        required: false,
        index: true,
    },
}, {
    _id: false,
})

const mediaListItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'UserModel'
    },
    mediaId: {
        type: Number,
        required: false,
    },
    mediaType: {
        type: String,
        required: true,
        uppercase: true,
        default: () => 'ANIME',
    },
    source: {
        type: String,
        required: true,
        uppercase: true,
        default: () => 'ANILIST',
    },
    sourceId: {
        type: String,
        required: false,
    },
    externalId: {
        type: String,
        required: false,
    },
    animeId: {
        type: Number,
        required: false,
    },
    entityRef: {
        type: entityRefSchema,
        required: false,
        default: undefined,
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
    progressTotal: {
      type: Number,
      required: true,
      default: () => -1
    },
    progressUnit: {
        type: String,
        required: true,
        lowercase: true,
        default: () => 'episodes'
    },
    rating: {
      type: Number,
      required: true,
      default: () => -1
    },
    image: {
      type: String,
      required: false,
      default: () => ''
    },
    format: {
        type: String,
        required: false,
    },
    genres: [String]


}, {
    collection: 'listItems'
})
mediaListItemSchema.plugin(timestamp)

module.exports = mongoose.model('MediaListItemModel', mediaListItemSchema)
