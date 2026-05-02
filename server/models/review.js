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

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'UserModel'
    },
    title: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    subjectId: {
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
    entityRef: {
        type: entityRefSchema,
        required: false,
        default: undefined,
    },
    body: {
        type: String,
        required: true,
    },
    flagged: {
        type: Boolean,
        required: true,
        default: false
    },
    suspended: {
        type: Boolean,
        required: true,
        default: false
    },
    comments: [
        {
            comment: {
                user: {
                    type: mongoose.SchemaTypes.ObjectId,
                    required: true,
                    ref: 'UserModel'
                },
                comment: {
                    type: String,
                    required: true,
                },
                flagged: {
                    type: Boolean,
                    required: true,
                    default: false
                },
                suspended: {
                    type: Boolean,
                    required: true,
                    default: false
                },
                createdAt: {
                    type: Date,
                    immutable: true,
                    default: () => Date.now(),
                }
            }
        }
    ]
}, {
    collection: 'reviews'
})
reviewSchema.plugin(timestamp)

module.exports = mongoose.model('ReviewModel', reviewSchema)
