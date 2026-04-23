const express = require('express')
const dotenv = require("dotenv")
const https = require('https')
const parseString = require('xml2js').parseString
const {sanitizeNewsFeed} = require('../../utils/sanitizeNewsFeed')
dotenv.config()

const router = express.Router()

router.get('/', async (req, res) => {

    https.get('https://www.animenewsnetwork.com/all/atom.xml?ann-edition=us', (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        })

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            parseString(data, function (err, result) {
                if(err) {
                    console.log("Error parsing Anime News Network feed: " + err.message)
                    res.sendStatus(400)
                    return
                }

                const {feed} = result ?? {}
                if(feed) {
                    res.status(200).send({feed: sanitizeNewsFeed(feed)})
                } else {
                    res.sendStatus(400)
                }

            })
        })
    }).on("error", (err) => {
        console.log("Error: " + err.message);
        res.sendStatus(502)
    })
})



module.exports = router
