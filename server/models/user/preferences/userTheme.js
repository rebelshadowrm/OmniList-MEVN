const mongoose = require('mongoose')

const userThemeSchema = new mongoose.Schema({
    listTheme: {
        type: {},
        required: false,
        default: () => {}
    },
    dashboardTheme: {
        type: {},
        required: false,
        default: () => {}
    },
    profileTheme: {
        type: {},
        required: false,
        default: () => {}
    }
})

module.exports = mongoose.model('UserThemeModel', userThemeSchema)
