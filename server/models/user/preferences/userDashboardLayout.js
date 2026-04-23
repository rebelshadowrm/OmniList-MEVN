const mongoose = require('mongoose')


const userDashboardLayoutSchema = new mongoose.Schema({
    home: {
        type: {},
        required: false,
        default: () => ({})
    },
    layout: {
        type: [],
        required: true,
        default: () => []
    }
})


module.exports = mongoose.model('UserDashboardLayoutModel', userDashboardLayoutSchema)
