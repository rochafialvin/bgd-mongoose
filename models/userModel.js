const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
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
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(val){
            // validasi apakah input dari user merupakan sebuah email
            // isEmail akan return antara true atau false
            let result = validator.isEmail(val)

            if(!result){
                throw new Error("Format email tidak dikenali")
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