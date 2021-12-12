const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try {
        // get token from cookie
        const token = await req.cookies && req.cookies.accessToken ? req.cookies.accessToken : null
        if (!token) throw new Error('Please login to continue.')

        // decrypt token
        const tokenValid = jwt.verify(token, process.env.ACCESS_TOKEN_SEC, (err, valid) => err ? null : valid)
        if (!tokenValid) throw new Error('Please login to continue.')

        // put user in req payload
        req.user = tokenValid
        next()
    }
    catch(err) {
        res.send({
            success: false,
            message: err.message,
            data: null
        })
    }
}