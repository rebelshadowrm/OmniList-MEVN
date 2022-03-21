const mongoose = require('mongoose')

const calendarSchema = new mongoose.Schema({
    calendar: {
        type: [],
        required: false,
    },
})

module.exports = mongoose.model('CalendarModel', calendarSchema)
