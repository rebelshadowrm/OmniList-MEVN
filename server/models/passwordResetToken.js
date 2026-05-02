const crypto = require('crypto')
const mongoose = require('mongoose')

const passwordResetTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'UserModel',
    },
    tokenHash: {
        type: String,
        required: true,
        index: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true,
    },
    usedAt: {
        type: Date,
        required: false,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
}, {
    collection: 'passwordResetTokens',
})

passwordResetTokenSchema.index({expiresAt: 1}, {expireAfterSeconds: 0})

passwordResetTokenSchema.statics.hashToken = function hashToken(token) {
    return crypto.createHash('sha256').update(`${token}`).digest('hex')
}

module.exports = mongoose.model('PasswordResetTokenModel', passwordResetTokenSchema)
