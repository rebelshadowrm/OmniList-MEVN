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
        ref: 'UserThemeModel',
        default: () => {}
    },
    profileLayout: {
        type: ProfileLayout,
        ref: 'ProfileLayoutModel',
        default: () => {}
    },
    dashboardLayout: {
        type: DashboardLayout,
        ref: 'DashboardLayoutModel',
        default: () => {}
    },
    newsPreferences: {
        type: NewsPreferences,
        ref: 'NewsPreferencesModel',
        default: () => {}
    },
    listPreferences: {
        type: ListPreferences,
        ref: 'ListPreferencesModel',
        default: () => {}
    },
    calendarPreferences: {
        type: CalendarPreferences,
        ref: 'CalendarPreferencesModel',
        default: () => {}
    }

})


module.exports = mongoose.model('UserPreferencesModel', userPreferencesSchema)