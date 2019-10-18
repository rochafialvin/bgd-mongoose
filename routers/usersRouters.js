const express = require('express')
const multer =require('multer')
const sharp = require('sharp')
const router = new express.Router()

const User = require('../models/userModel')

// MULTER CONF
const upload = multer({
    limits: {
        fileSize: 1000000 // 1MB = 1000000 Byte
    },
    fileFilter(req, file, callback){

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error('Format file harus jpg / png / jpeg'))
        }

        callback(null, true)
    }
})

// UPLOAD AVATAR
router.post('/users/avatar/:userid', upload.single('avatar') , async (req, res) => {
    
    try {
        // resize lebar gambar : 250 px, extension .png
        let buffer = await sharp(req.file.buffer).resize({ width: 250 }).png().toBuffer()
        let user = await User.findById(req.params.userid)
        // user {id, name, ...., avatar}
        user.avatar = buffer

        await user.save()
        res.send("Upload berhasil")
        
    } catch (error) {
        res.send(error)
    }

}, (err, req, res, next) => {
    res.send({
        err: err.message
    })
})

// READ AVATAR
router.get('/users/avatar/:userid', async (req, res) => {

    try {
        let user = await User.findById(req.params.userid)

        // Secara default content-type adalah json, kita ubah menjadi image karena kita akan mengirim sebuah gambar
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (error) {
        res.send(error)
    }

})


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
        const user = await User.findById(req.params.userid)
        res.send({
            user,
            avatar: `http://localhost:2019/users/avatar/${req.params.userid}`
        })
        
    } catch (err) {
        res.send(err)
    }

})

// UPDATE PROFILE
router.patch('/users/:userid', async (req, res) => {
    let updates = Object.keys(req.body) // ['name', 'email', ...]
    let allowedUpdates = [ 'name', 'email', 'password', 'age' ]
    let result = updates.every(update => {return allowedUpdates.includes(update)})

    // Jika ada field yang akan di edit selain [ 'name', 'email', 'password', 'age' ]

    if(!result){
        return res.send({err: "Invalid Request"})
    }

    try {
        let user = await User.findById(req.params.userid)
        
        updates.forEach((val) => { user[val] = req.body[val] })

        await user.save()

        res.send(user)

    } catch (error) {
        res.send(error)
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