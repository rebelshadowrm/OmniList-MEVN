const mongoose = require('mongoose')


const newsSchema = new mongoose.Schema({
    news: {
        type: [],
        required: false,
    },
})


module.exports = mongoose.model('NewsModel', newsSchema)
