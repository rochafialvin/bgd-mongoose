const express = require('express')
const router = new express.Router()

const User = require('../models/userModel')

// CREATE ONE USER
router.post('/users', (req, res) => {

    const user = new User(req.body)

    // disimpan ke database
    user.save()
        .then((resp) => { res.send("Manteb") })
        .catch((err) => { res.send (err) })

})

// READ ALL USER
router.get('/users', async (req, res) => {

    try {
        let users = await User.find({})
        res.send(users)

    } catch (error) {
        res.send(error)

    }

})

// READ ONE USER BY ID
router.get('/users/:userid', async (req, res) => {

    try {
        const resp = await User.findById(req.params.userid)
        res.send(resp)
        
    } catch (err) {
        res.send(err)
    }

})

// DELETE ONE BY ID
router.delete('/users/:userid', async (req, res) => {

    try {
        let resp = await User.deleteOne({_id : req.params.userid})
        res.send(resp)

    } catch (error) {
        res.send(error)

    }

})

// LOGIN USER WITH EMAIL PASSWORD
router.post('/users/login', async (req, res) => {

    try {
        let user = await User.login(req.body.email, req.body.password)
        res.send(user)

    } catch (error) {
        res.send(error.message)
    }
        

})

module.exports = router