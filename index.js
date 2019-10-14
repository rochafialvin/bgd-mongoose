const express = require('express')
const mongoose = require('mongoose')

const User = require('./models/userModel')

const app = express()
const port = 2019
const URL = 'mongodb://127.0.0.1:27017/bdg-mongoose'

mongoose.connect(
    URL,
    {
        // Menggunakan url parser yang baru
        useNewUrlParser: true,
        // Menggunakan method baru 'CreateIndex' untuk membuat index stiap kali kita input sebuah data
        useCreateIndex: true,
        // Menggunakan method baru untuk proses findOneAndUpdate()
        useFindAndModify: true,
        // Menggunakan engine mongoDB baru
        useUnifiedTopology: true
        
    }
)

// Agar API dapat memproses json
app.use(express.json())


// CREATE ONE USER
app.post('/users', (req, res) => {

    const user = new User(req.body)

    user.save()
        .then(() => { res.send('Data berhasil disimpan')})
        .catch(() => { res.send (err) })

})



















app.listen(port, () => { console.log(`Running at ${port}`) })