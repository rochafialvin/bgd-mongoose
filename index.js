const express = require('express')
const mongoose = require('mongoose')


const User = require('./models/userModel')
const Task = require('./models/taskModel')

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

// U S E R  R O U T E R

// CREATE ONE USER
app.post('/users', (req, res) => {

    const user = new User(req.body)

    // disimpan ke database
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
app.delete('/users/:userid', async (req, res) => {

    try {
        let resp = await User.deleteOne({_id : req.params.userid})
        res.send(resp)

    } catch (error) {
        res.send(error)

    }

})

// LOGIN USER WITH EMAIL PASSWORD
app.post('/users/login', async (req, res) => {

    try {
        let user = await User.login(req.body.email, req.body.password)
        res.send(user)

    } catch (error) {
        res.send(error.message)
    }
        

})


// T A S K  R O U T E R

// CREATE TASK
app.post('/tasks', async (req, res) => {

    try {
        let task = new Task(req.body)
        let resp = await task.save()
        res.send(resp)

    } catch (error) {
        res.send(error.message)

    }
    
})

// UPDATE TASK
app.patch('/tasks/:taskid', async (req, res) => {
    try {
        // Cari task berdasarkan id
        let task = await Task.findById(req.params.taskid)
        // task = {description, completed}
        // Update completed menjadi true
        task.completed = true
        // Simpan task yang sudah di update
        await task.save()
        // Kirim respon
        res.send({updatedTask : task})

    } catch (error) {
        res.send(error)
    }

})


// DELETE TASK
app.delete('/tasks/:taskid', async (req, res) => {

    try {
        let task = await Task.findByIdAndDelete(req.params.taskid)
        res.send({deletedTask : task})
        
    } catch (error) {
        res.send(error)
    }

})


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


User.login(req.body.email, req.body.password)
        .then(resp => {
            res.send({
                kodisi: "Berhasil",
                pesan: resp
            })

        }).catch(error => {
            res.send({
                kondisi: "Gagal",
                pesan: error.message
            })
        })
*/