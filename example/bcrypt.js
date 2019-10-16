const bcrypt = require('bcrypt')

let password = 'Hello123'
let hash = '$2b$08$7qDioRMmRTD9YrnLF4/b0OcFhbElIaSxQO/N5N6.cVowOFuv6768y'

// Hashing
bcrypt.hash(password, 8)
    .then(res => {
        console.log({
            password , res
        })
    })

// Compare
// akan return true or false
bcrypt.compare(password, hash)
    .then(res => {
        console.log(res)
    })