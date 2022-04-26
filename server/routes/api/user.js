const express = require('express')
const mongodb = require('mongodb')
const dotenv = require("dotenv")
dotenv.config()
require('../../database')
const UserModel = require('../../models/user/user')
const authenticateToken = require('../../security/authenticateToken')

const router = express.Router()

// Get Users
router.get('/', authenticateToken, async (req, res) => {
    res.send(await UserModel.find())
})

// Get User by ID
router.get('/:id', authenticateToken, async (req, res) => {
    if(req?.params?.id !== undefined) {
        const user = await UserModel.findOne().where('_id').equals(req?.params?.id)
        if(user) {
            res.status(200).send(user)
        } else {
            res.sendStatus(400)
        }
    } else {
        res.sendStatus(400)
    }

})

// Get User by Username
router.get('/username/:username', authenticateToken, async (req, res) => {
    const user = await UserModel.findOne({ userName: req.params.username })
    if(user) {
        res.status(200).send(user)
    } else {
        res.sendStatus(400)
    }
})

// Update User
router.put('/:id', authenticateToken, async (req, res) => {
    if(req?.params?.id) {
        const user = await UserModel.findById(req?.params?.id)
        if(user) {
            if(req?.user?.user?._id === req?.params?.id) {
                if(req?.body?.userName) {
                    const userName = await UserModel.findOne({userName: req?.body?.userName})
                    if(userName) {
                        return res.sendStatus(209)
                    } else {
                        user.userName = req?.body?.userName ?? user.userName
                    }
                }
                user.firstName = req?.body?.firstName
                user.lastName = req?.body?.lastName
                user.userPreferences = req?.body?.userPreferences ?? user.userPreferences
                user.userPreferences.themes.profileTheme = req?.body?.userPreferences?.themes?.profileTheme ?? user.userPreferences.themes.profileTheme
                if(req?.body?.addFavorite) {
                    const add = req?.body?.addFavorite
                    const filter = user?.userProfile?.favorites?.animeFavorites
                        .filter( ({anime}) => anime?.id === add?.id )
                    if(filter?.length === 0) {
                        user.userProfile.favorites.animeFavorites.push({
                            anime: add
                        })
                    }
                }
                if (req?.body?.removeFavorite) {
                    const remove = req?.body?.removeFavorite
                    user.userProfile.favorites.animeFavorites
                        =
                        user.userProfile.favorites.animeFavorites
                        .filter(({anime}) => anime?.id !== remove?.id)
                }
                if (req?.body?.socialName) {
                    user.userProfile.socials.push({
                        socialName: req?.body?.socialName,
                        socialType: req?.body?.socialType,
                        socialValue: req?.body?.socialValue
                    })
                }
                if (req?.body?.removeSocial) {
                    const id = req?.body?.removeSocial
                    user.userProfile.socials =
                        user.userProfile.socials
                        .filter( ({_id}) => _id.toString() !== id )
                }
            }

            // Admin / Mod changes
            if(req?.user?.user?.role === 'ADMIN') {

                user.role = req?.body?.role ?? user.role
            }
            if(req?.user?.user?.role === 'ADMIN' || req?.user?.user?.role === 'MOD') {
                user.status = req?.body?.status ?? user.status
            }

            user.save()
            return res.status(200).send(user)
        } else {
            return res.sendStatus(400)
        }
    }

})

module.exports = router
