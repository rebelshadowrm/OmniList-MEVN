const express = require('express')
const mongodb = require('mongodb')
const dotenv = require("dotenv")
dotenv.config()
require('../../database')
const ReviewModel = require('../../models/review')
const router = express.Router()


// Get Reviews
router.get('/', async (req, res) => {
    res.send(await ReviewModel.find()
        .populate('user')
        .populate('comments.comment.user'))
})

router.get('/:id', async (req, res) => {
    res.send(await ReviewModel.findById(req.params.id)
        .populate('user')
        .populate('comments.comment.user'))
})

// Get reviews by anime
router.get('/anime/:id', async (req, res) => {
    res.send(await ReviewModel
        .where('subjectId')
        .equals(req?.params?.id)
        .populate('user')
        .populate('comments.comment.user'))
})

// Get reviews by user
router.get('/user/:id', async (req, res) => {
    res.send(await ReviewModel
        .where('user')
        .equals(req?.params?.id)
        .populate('user')
        .populate('comments.comment.user'))
})

// Add review
router.post('/', async (req, res) => {
    let review = await ReviewModel.create({
        user: req.body.user,
        title: req.body.title,
        subject: req.body.subject,
        subjectId: req.body.subjectId,
        body: req.body.body,
        comments: req.body.comments
    })
    if(review) {
        review = await review.populate('user')
        review = await review.populate('comments.comment.user')
        res.status(201).send(review)
    } else {
        res.sendStatus(400)
    }
})

// Update Review
router.put('/:id', async (req, res) => {
    try {
        const review = await ReviewModel.findOne({_id: req.params.id})
        review.title = req?.body?.title ?? review.title
        review.body = req?.body?.body ?? review.body
        review.flagged = req?.body?.flagged ?? review.flagged
        review.suspended = req?.body?.suspended ?? review.suspended
        const result = await review.save()
        if(result) {
            res.sendStatus(200)
        } else {
            res.sendStatus(400)
        }
    } catch(err) {
        console.log(err.message)
    }
})

// Delete Review
router.delete('/:id', async (req, res) => {
    if(await ReviewModel.deleteOne({ _id: req.params.id })) {
        res.sendStatus(204)
    } else {
        res.sendStatus(400)
    }
})

// Delete Comment
router.delete('/comment/delete', async (req, res) => {
    try {
        const review = await ReviewModel.findOne({_id: req.body.reviewId})
        let comments = review.comments
        comments = comments.filter( ({_id}) => _id != req.body.commentId )
        review.comments = comments
        const result = await review.save()
        if(result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    } catch(err) {
        console.log(err.message)
    }
})

// Add Comment
router.post('/comment/add', async (req, res) => {
    try {
        let review = await ReviewModel.findOne({_id: req.body.reviewId})
        const comments = review.comments
        const comment = {
            comment: {
                user: new mongodb.ObjectId(req.body.userId),
                comment: req.body.comment
            }
        }
        comments.push(comment)
        const result = await review.save()
        if(result) {
            review = await review.populate('user')
            review = await review.populate('comments.comment.user')
            res.status(201).send(review)
        } else {
            res.sendStatus(400)
        }
    } catch(err) {
        console.log(err.message)
    }
})

// Update Comment
router.put('/comment/update', async (req, res) => {
    try {
        const review = await ReviewModel.findOne({_id: req.body.reviewId})
        const comments = review.comments
        const comment = comments.find( ({_id}) => _id == req.body.commentId )
        comment.comment.comment = req.body.comment
        comment.comment.suspended = req?.body?.suspended ?? comment.comment.suspended
        comment.comment.flagged = req?.body?.flagged ?? comment.comment.flagged
        review.comments = comments
        const result = await review.save()
        if(result) {
            res.sendStatus(200)
        } else {
            res.sendStatus(400)
        }
    } catch(err) {
        console.log(err.message)
    }
})

module.exports = router
