const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(cors())

const posts = require('./routes/api/posts')
const login = require('./routes/api/login')
const register = require('./routes/api/register')
const user = require('./routes/api/user')
const refresh = require('./routes/api/refresh')
const logout = require('./routes/api/logout')


app.use('/api/posts', posts)
app.use('/api/login', login)
app.use('/api/register', register)
app.use('/api/user', user)
app.use('/api/refresh', refresh)
app.use('/api/logout', logout)


// Handle production
if (process.env.NODE_ENV === 'production') {
    // Static folder
    app.use(express.static(__dirname + '/public/'))

    // Handle SPA
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
}

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server started on port ${port}`))
