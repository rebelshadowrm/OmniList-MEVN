const express = require('express')
const dotenv = require("dotenv")
const https = require('https')
const parseString = require('xml2js').parseString
dotenv.config()
require('../../database')

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
                const {feed} = result
                console.log(feed)
                if(feed) {
                    res.status(200).send({feed})
                } else {
                    res.sendStatus(400)
                }

            })
        })
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
})



module.exports = router
