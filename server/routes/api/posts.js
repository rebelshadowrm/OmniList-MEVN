const express = require('express')
const mongodb = require('mongodb')
const dotenv = require("dotenv")
dotenv.config()
require('../../database')
const PostModel = require('../../models/post')

const router = express.Router()


// Get Posts
router.get('/', async (req, res) => {
    res.send(await PostModel.find())
})

// Add Post
router.post('/', async (req, res) => {
    const post = await PostModel.create({
        text: req.body.text,
    })
    if(post) {
        res.status(201).send(post)
    } else {
        res.sendStatus(400)
    }
})

// Delete Post
router.delete('/:id', async (req, res) => {
    if(await PostModel.deleteOne({ _id: new mongodb.ObjectId(req.params.id) })) {
        res.status(204).send({"id": req.params.id})
    } else {
        res.sendStatus(400)
    }
})

module.exports = router
