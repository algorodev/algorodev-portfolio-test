const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dbConnect = require('./db/dbConnect')
const User = require('./db/userModel')
const auth = require('./auth')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    )
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    )
    next()
})

app.get('/', (req, res, next) => {
    res.json({ message: 'Hey! This is your server response' })
    next()
})

app.post('/register', (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then((hashedPassword) => {
            const user = new User({
                email: req.body.email,
                password: hashedPassword
            })

            user.save()
                .then((result) => {
                    res.status(201).send({
                        message: 'User created successfully',
                        result: result
                    })
                })
                .catch((error) => {
                    res.status(500).send({
                        message: 'Error creating user',
                        error: error
                    })
                })
        })
        .catch((error) => {
            res.status(500).send({
                message: 'Password was not hashed successfully',
                error: error
            })
        })
})

app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            bcrypt.compare(req.body.password, user.password)
                .then((passwordMatch) => {
                    if (!passwordMatch) {
                        return res.status(400).send({
                            message: 'Password does not match'
                        })
                    }

                    const token = jwt.sign(
                        {
                            userId: user._id,
                            userEmail: user.email
                        },
                        'RANDOM_TOKEN',
                        { expiresIn: '24h' }
                    )

                    res.status(200).send({
                        message: 'Login successful',
                        email: user.email,
                        token: token
                    })
                })
                .catch((error) => {
                    res.status(400).send({
                        message: 'Password does not match',
                        error: error
                    })
                })
        })
        .catch((error) => {
            res.status(404).send({
                message: 'Email not found',
                error: error
            })
        })
})

app.get('/free-endpoint', (req, res) => {
    res.json({ message: 'You are free to access me anytime' })
})

app.get('/auth-endpoint', auth, (req, res) => {
    res.json({ message: 'You are authorized to access me' })
})

dbConnect()
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!')
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!')
        console.error(error)
    })

module.exports = app
