const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

// rochafi

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
        validate(val) {
            if(val.toLowerCase().includes("password")){
                throw new Error("Password tidak boleh mengandung kata 'password'")
            }
        }
    },
    age: {
        type: Number,
        set: val => parseInt(val),
        default: 0 // Jika user tidak menginput informasi umur
    },
    avatar : { // Menyimpan image dalam bentuk binary
        type: Buffer
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref :'Task'
    }]

}, {
    timestamps: true
})

// toJSON adalah function yang akan running sebelum function 'send()' pada object 'res'
userSchema.methods.toJSON = function() {
    // Untuk mengakses user
    let user = this.toObject()

    delete user.password
    delete user.tasks
    delete user.avatar

    return user
}


// Membuat function yang akan dijalankan sebeleum proses user.save()
userSchema.pre('save', async function(next) {
    // Mengubah password yang di input dari user kedalam bentuk lain
    let user = this

    // Hash password
    user.password = await bcryptjs.hash(user.password, 8)

    // Untuk kemudian menjalankan save
    next() 
})

// Membuat login function
userSchema.statics.login = async (email, password) => {

    // Mencari user berdasarkan email
    let user = await User.findOne({email})

    // Jika user tidak di temukan
    // akan ada di catch(), error
    if(!user){
        throw new Error(`User dengan email ${email} tidak ditemukan`)
    }

    // Bandingkan password dari input user dg yang ada di database
    // result = true or false
    let result = await bcryptjs.compare(password, user.password)

    // Jika password tidak match
    if(!result){
        throw new Error("Password belum benar")
    }

    // akan ada di then() , resp
    return user

}

const User = mongoose.model('User', userSchema)

module.exports = User

// LATIHAN : Password tidak boleh mengandung kata 'password'