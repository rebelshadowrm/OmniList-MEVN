const mongoose = require('mongoose')
const timestamp = require("./plugins/timestamp");

const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
}, {
    collection: 'posts'
})
postSchema.plugin(timestamp)

module.exports = mongoose.model('PostModel', postSchema)