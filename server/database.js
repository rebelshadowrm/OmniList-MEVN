const mongoose = require('mongoose')
const dotenv = require("dotenv")
dotenv.config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@omnilist.dwbjx.mongodb.net/omnilist?retryWrites=true&w=majority`

class Database {
    constructor() {
        this._connect(uri).then()
    }

    async _connect(uri) {
        try {
            await  mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }, () => console.log('Database connection successful'))
        } catch(err) {
            console.error('Database connection error', err)
        }

    }
}

module.exports = new Database()