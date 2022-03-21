const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
}, {
    collection: 'tokens'
})

module.exports = mongoose.model('TokenModel', tokenSchema)