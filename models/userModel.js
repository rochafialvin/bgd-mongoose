const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        set: (val) => { return val.replace(/ /g, '') }, // val = data dari user, menghapus semua spasi
        validate(val){
            // val = 123
            val = parseInt(val)
            // val = 123

            // Akan bernilai true jika inputan dari user merupakan sebuah angka
            if(!isNaN(val)){
                throw new Error("Username harus merupakan sebuah string")
            }
        }
    },
    name: {
        type: String,
        required: true, // wajib di isi
        trim: true, // menghapus spasi di awal dan akhir kalimat
        validate(val){
            // val = 123
            val = parseInt(val)
            // val = 123

            // Akan bernilai true jika inputan dari user merupakan sebuah angka
            if(!isNaN(val)){
                throw new Error("Name harus merupakan sebuah string")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7, // Minimal 7 karakter
    },
    age: {
        type: Number,
        set: val => parseInt(val),
        default: 0 // Jika user tidak menginput informasi umur
    }

})

const User = mongoose.model('User', userSchema)

module.exports = User