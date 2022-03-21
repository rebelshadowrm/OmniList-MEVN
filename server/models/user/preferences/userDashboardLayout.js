const mongoose = require('mongoose')


const userDashboardLayoutSchema = new mongoose.Schema({
    layout: {
        type: [],
        required: true,
        default: () => []
    }
})


module.exports = mongoose.model('UserDashboardLayoutModel', userDashboardLayoutSchema)