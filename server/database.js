const mongoose = require('mongoose')
const dotenv = require("dotenv")
dotenv.config()

mongoose.set('strictQuery', false)

const DEFAULT_DB_HOST = 'omnilist.dwbjx.mongodb.net'
const DEFAULT_DB_NAME = 'omnilist'

function requiredEnv(name) {
    const value = process.env[name]

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }

    return value
}

function connectionString() {
    if (process.env.MONGODB_URI) {
        return process.env.MONGODB_URI
    }

    if (process.env.DB_URI) {
        return process.env.DB_URI
    }

    const username = encodeURIComponent(requiredEnv('DB_USERNAME'))
    const password = encodeURIComponent(requiredEnv('DB_PASSWORD'))
    const host = process.env.DB_HOST ?? DEFAULT_DB_HOST
    const name = process.env.DB_NAME ?? DEFAULT_DB_NAME

    return `mongodb+srv://${username}:${password}@${host}/${name}?retryWrites=true&w=majority`
}

class Database {
    constructor() {
        this.connectionPromise = null
        this.eventsRegistered = false
    }

    registerConnectionEvents() {
        if (this.eventsRegistered) {
            return
        }

        mongoose.connection.on('connected', () => {
            console.log(`MongoDB connected: ${mongoose.connection.name}`)
        })

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected')
        })

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err.message)
        })

        this.eventsRegistered = true
    }

    async connect() {
        if (mongoose.connection.readyState === 1) {
            return mongoose.connection
        }

        if (this.connectionPromise) {
            return this.connectionPromise
        }

        this.registerConnectionEvents()

        this.connectionPromise = mongoose.connect(connectionString())
            .then((mongooseInstance) => mongooseInstance.connection)
            .catch((err) => {
                this.connectionPromise = null
                throw err
            })

        return this.connectionPromise
    }

    async disconnect() {
        if (mongoose.connection.readyState === 0) {
            return
        }

        await mongoose.disconnect()
        this.connectionPromise = null
    }
}

module.exports = new Database()
