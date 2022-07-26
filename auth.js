const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = await jwt.verify(token, 'RANDOM_TOKEN')
        req.user = await decodedToken
        next()
    } catch (error) {
        res.status(401).json({
            error: new Error('Invalid request')
        })
    }
}
