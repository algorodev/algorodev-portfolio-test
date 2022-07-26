const mongoose = require('mongoose')
require('dotenv').config()

async function dbConnect() {
    mongoose.connect(process.env.DB_URL)
}

module.exports = dbConnect
