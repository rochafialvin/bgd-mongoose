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
        .then((resp) => { res.send(resp)})
        .catch((err) => { res.send (err) })

})

// READ ALL USER
app.get('/users', async (req, res) => {

    try {
        let users = await User.find({})
        res.send(users)

    } catch (error) {
        res.send(error)

    }

})

// READ ONE USER BY ID
app.get('/users/:userid', async (req, res) => {

    try {
        const resp = await User.findById(req.params.userid)
        res.send(resp)
        
    } catch (err) {
        res.send(err)
    }

})

// DELETE ONE BY ID


// UPDATE BY ID










app.listen(port, () => { console.log(`Running at ${port}`) })

/*
try {
    let resp1 = await axios.get(username)
    let resp2 = await axios.get(email)
    let resp3 = await axios.post(newuser)
} catch (err) {
    console.log(err)
}

    axios.get(username)
        .then(res => {
            axios.get(email)
                .then(res => {
                    axios.post(new user)
                        .then(res => {

                        }).catch(err => {

                        })
                }).catch(err => {

                })
        }).catch(err => {

        })
*/