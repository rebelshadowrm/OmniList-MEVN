const mongoose = require('mongoose')
const MediaListItem = require('./mediaListItem').schema

const mediaListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'UserModel'
    },
    list: {
        type: [MediaListItem],
        required: false,
        ref: 'MediaListItemModel'
    },
})

module.exports = mongoose.model('MediaListModel', mediaListSchema)
