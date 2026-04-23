const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const database = require('./database')
const dotenv = require("dotenv")
dotenv.config()

const app = express()

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(cors())

const news = require('./routes/api/news')
const login = require('./routes/api/login')
const register = require('./routes/api/register')
const user = require('./routes/api/user')
const refresh = require('./routes/api/refresh')
const logout = require('./routes/api/logout')
const reviews = require('./routes/api/reviews')
const discussions = require('./routes/api/discussions')
const mediaList = require('./routes/api/mediaList')
const tmdb = require('./routes/api/tmdb')

app.use('/api/news', news)
app.use('/api/media-list', mediaList)
app.use('/api/anime', mediaList)
app.use('/api/tmdb', tmdb)
app.use('/api/discussions', discussions)
app.use('/api/reviews', reviews)
app.use('/api/login', login)
app.use('/api/register', register)
app.use('/api/user', user)
app.use('/api/refresh', refresh)
app.use('/api/logout', logout)


// Handle production
if (process.env.NODE_ENV !== 'dev') {

    // Static folder
    app.use(express.static(__dirname + '/public/'))

    // Handle SPA
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
}

const port = process.env.PORT || 5000

async function start() {
    try {
        await database.connect()

        const server = app.listen(port, () => console.log(`Server started on port ${port}`))

        async function shutdown(signal) {
            console.log(`${signal} received. Closing server...`)
            server.close(async () => {
                await database.disconnect()
                process.exit(0)
            })
        }

        process.once('SIGINT', shutdown)
        process.once('SIGTERM', shutdown)
    } catch (err) {
        console.error('Server startup failed:', err.message)
        process.exit(1)
    }
}

start()
