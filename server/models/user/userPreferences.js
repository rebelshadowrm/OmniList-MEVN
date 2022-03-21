const mongoose = require('mongoose')
const UserTheme = require('./preferences/userTheme').schema
const ProfileLayout = require('./preferences/userProfileLayout').schema
const DashboardLayout = require('./preferences/userDashboardLayout').schema
const NewsPreferences = require('./preferences/userNewsPreferences').schema
const ListPreferences = require('./preferences/userListPreferences').schema
const CalendarPreferences = require('./preferences/userCalendarPreferences').schema


const userPreferencesSchema = new mongoose.Schema({
    themes: {
        type: UserTheme,
        default: () => {}
    },
    profileLayout: {
        type: ProfileLayout,
        default: () => {}
    },
    dashboardLayout: {
        type: DashboardLayout,
        default: () => {}
    },
    newsPreferences: {
        type: NewsPreferences,
        default: () => {}
    },
    listPreferences: {
        type: ListPreferences,
        default: () => {}
    },
    calendarPreferences: {
        type: CalendarPreferences,
        default: () => {}
    }

})


module.exports = mongoose.model('UserPreferencesModel', userPreferencesSchema)