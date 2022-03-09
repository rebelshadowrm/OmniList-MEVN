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
});

// Add Post
router.post('/', async (req, res) => {
    await PostModel.create({
        text: req.body.text,
    });
    res.status(201).send()
});

// Delete Post
router.delete('/:id', async (req, res) => {
    await PostModel.deleteOne({ _id: new mongodb.ObjectId(req.params.id) })
    res.status(200).send({})
});


module.exports = router
