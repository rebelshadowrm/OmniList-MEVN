const mongoose = require('mongoose')
const Calendar = require('../../calendar').schema

const userCalendarPreferencesSchema = new mongoose.Schema({
    calendar: {
        type: Calendar,
        required: true,
        default: () => {}
    },
    tracking: {
        type: [],
        required: false,
        default: () => []
    }

})


module.exports = mongoose.model('UserCalendarPreferencesModel', userCalendarPreferencesSchema)