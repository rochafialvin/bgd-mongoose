const express = require('express')
const mongoose = require('mongoose')

const userRouter = require('./routers/usersRouters')
const taskRouter = require('./routers/tasksRouters')

const app = express()
const port = process.env.PORT || 2019 // Port heroku || Port localhost
const URL = 'mongodb+srv://rochafi:Youcanatlas99@bdg-mongoose-kh4p6.mongodb.net/bdg-mongoose?retryWrites=true&w=majority'

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
app.use(userRouter)
app.use(taskRouter)

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