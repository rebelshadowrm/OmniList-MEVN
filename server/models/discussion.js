const mongoose = require('mongoose')
const timestamp = require("./plugins/timestamp");

const discussionSchema = new mongoose.Schema({
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
        required: true,
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
    collection: 'discussions'
})
discussionSchema.plugin(timestamp)

module.exports = mongoose.model('DiscussionModel', discussionSchema)