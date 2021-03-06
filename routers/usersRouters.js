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
    fileFilter(req, file, cb){

        // Filter bedasarkan extention file (.jpg, .png. jpeg)
        let result = file.originalname.match(/\.(jpg|jpeg|png)$/)
        // extention bkan jpg | jpeg |png = false
        // extention jpg | jpeg |png = true

        if(!result){
            // file di tolak
            return cb(new Error('Format file harus jpg / png / jpeg'))
        }

        // file di terima
        cb(null, true)
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
router.post('/users', async (req, res) => {

    const user = new User(req.body)

    // disimpan ke database
    try {
        await user.save()
        res.send(user)

    } catch (e) {
        // e.errors = {username, email}

        // Object.keys(e.errors) = [ 'username', 'email' ]

        // Object.keys(e.errors)[0] = 'username'

        // e.errors[Object.keys(e.errors)[0]] = {message, name, kind, path, ..}

        // e.errors[Object.keys(e.errors)[0]].message = username 'rochafi' sudah digunakan

        res.send({
            error: e.errors[Object.keys(e.errors)[0]].message
        })

    }

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

// Dapat update tanpa harus update password dan avatar
router.patch('/users/:userid', upload.single('avatar'), async (req, res) => {
    if(!req.body.password){
        delete req.body.password
    }

    let updates = Object.keys(req.body) // ['name', 'email', 'age', 'password']
    let allowedUpdates = [ 'name', 'email', 'password', 'age' ]
    let result = updates.every(update => {return allowedUpdates.includes(update)})

    // Jika ada field yang akan di edit selain [ 'name', 'email', 'password', 'age' ]

    if(!result){
        return res.send({err: "Invalid Request"})
    }

    try {
        // Get user untuk di edit
        let user = await User.findById(req.params.userid)
        // Edit data untuk name, password, email, age
        updates.forEach((val) => { user[val] = req.body[val] })
        // Edit data untuk image
        let buffer = await sharp(req.file.buffer).resize({ width: 250 }).png().toBuffer()
        user.avatar = buffer

        // save setelah edit
        await user.save()
        // kirim ke client (react, postman)
        res.send(user)

    } catch (error) {
        res.send(error.message)
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
        res.send({
            error: error.message
        })
    }
        

})

module.exports = router