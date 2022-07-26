const mongoose = require('mongoose')
require('dotenv').config()

async function dbConnect() {
    mongoose.connect('mongodb+srv://algorodev:Alg0r0D3v@algorodev.6hagy.mongodb.net/portfolio?retryWrites=true&w=majority')
}

module.exports = dbConnect
