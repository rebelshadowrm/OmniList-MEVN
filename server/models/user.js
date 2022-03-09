const mongoose = require('mongoose')
const timestamp = require("./plugins/timestamp");
const validator = require('validator').default

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value)
            }
        }
    },
    role: {
        type: String,
        uppercase: true,
    },
}, {
    collection: 'users'
})
 userSchema.plugin(timestamp)

module.exports = mongoose.model('UserModel', userSchema)